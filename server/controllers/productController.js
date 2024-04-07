const Product = require('../models/product');
const User = require('../models/user');
const path = require('path');
const fs = require('fs');
exports.createproduct = async(req, res, next) =>{
    try{
        console.log("Request Body:", req.body);
        const { name, price, description, ownerName, userId } = req.body;
        console.log('name:', name)
        console.log('price:', price)
        console.log('description:', description)
        console.log('ownerName:', ownerName)
        console.log('userId: ', userId)
        const image = req.file;
        console.log(image)
        if (!image || !image.path ) { 
            return res.status(400).json({ error: 'Image is required' });
        }
        const originalFilename = image.originalname;
        const safeFilename = originalFilename.replace(/[^a-zA-Z0-9.]/g, '_');
        const productSafeName = name.replace(/\s+/g, '-').toLowerCase();
        const imageName = `${productSafeName}_${safeFilename}`;

        const uploadsDirectory = 'uploads'; 
        const filePath = path.join(uploadsDirectory, imageName);
        const fileContent = fs.readFileSync(image.path);
        fs.writeFileSync(filePath, fileContent);

        
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found')
            return res.status(404).json({ error: 'User not found' });
        }

        const product = new Product({
            name, 
            price, 
            description,  
            ownerName, 
            image:imageName ,
            seller: userId
        });
        console.log(product)
        const saveProduct = await product.save();
        res.status(201).json(saveProduct);
    } catch (error){
        next(error);
    }
};


exports.getAllProducts = async(req, res, next) => {
    try{
        const products = await Product.find();
        // console.log("All product:", products);
        res.json(products);
    }catch (error){
        next(error);
    }
};


exports.getProductById = async(req, res, next) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId).populate('seller', 'fullname');
        console.log(product)
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        res.json(product);
    } catch(error) {
        next(error);
    }
};


exports.updateProductById = async (req, res, next) =>{
    try {
        const productId = req.params.productId;
        console.log("Product Id:", productId);
        const { name, price, description, image, quantity_left, brand } = req.body;
        const updateProduct = await Product.findByIdAndUpdate(productId, {
            name, price, description, image, quantity_left, brand
        }, { new : true });
        if (!updateProduct) {
            return res.status(404).json({
                message:'Product not found'
            });
        }
        res.json(updateProduct);
    } catch (error){
        next(error);
    }
};


exports.deleteProductById = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};
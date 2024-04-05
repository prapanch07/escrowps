const Product = require('../models/product');

exports.createproduct = async(req, res, next) =>{
    try{
        console.log("Request Body:", req.body);
        const { name, price, description, image, quantity_left, brand } = req.body;
        const product = new Product({
            name, price, description, image, quantity_left, brand
        });
        const saveProduct = await product.save();
        res.status(201).json(saveProduct);
    } catch (error){
        next(error);
    }
};


exports.getAllProducts = async(req, res, next) => {
    try{
        const products = await Product.find();
        console.log("All product:", products);
        res.json(products);
    }catch (error){
        next(error);
    }
};


exports.getProductById = async(req, res, next) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);
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
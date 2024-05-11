const Product = require('../models/product');
const User = require('../models/user');
const BidRoom = require('../models/bidRoommodel');
const Bid = require('../models/bidsmodel')
const path = require('path');
const fs = require('fs');
exports.createproduct = async(req, res, next) =>{
    try{
        const { name, price, description, ownerName, userId } = req.body;
        const image = req.file;
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
        const saveProduct = await product.save();
        res.status(201).json(saveProduct);
    } catch (error){
        next(error);
    }
};


exports.getAllProducts = async(req, res, next) => {
    try{
        const products = await Product.find({deleted:false});

        res.json(products);
    }catch (error){
        next(error);
    }
};

exports.getBidProducts = async(req, res, next) => {
    try{
        console.log('getBidProducts: ')
        const products = await Product.find({allow_bids:true});
        console.log('products :',products)
        res.json(products);
    } catch(error){
        next("Error Fetching bid products",error);
    }
};


exports.getProductById = async(req, res, next) => {
    try {
        
        const productId = req.params.productId;
        console.log('getProductById:', productId )
        const product = await Product.findById(productId).populate('seller', 'fullname');
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        res.json(product);
    } catch(error) {
        next("Error in fetching product",error);
    }
};


exports.updateProductById = async (req, res, next) =>{
    try {
        const productId = req.params.productId;
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
        const product = await Product.findById(productId);
        product.deleted=true;
        product.allow_bids=false;
        product.save();
        

        console.log('product deleting', product.name);
        console.log(product);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.getProductsByuser = async (req, res, next) => {
    
    try {
        const userId = req.params.userId;
        const products = await Product.find({seller: userId, deleted:false}).exec();
        res.json(products)
    } catch(error) {
        next(error);
    }
};

exports.closebidding=async(req, res,next)=>{
    try{
        const productId = req.params.productId
        console.log(productId)
        const product = await Product.findById(productId);
        product.allow_bids=false
        product.save()

        const bidrooms = await BidRoom.find({product:productId});
        for (const bidroom of bidrooms){
            bidroom.open=false
            bidroom.closed=true
            bidroom.save()
            console.log('bidroom._id',bidroom._id)
            const bids = await Bid.find({
                bidRoom:bidroom._id, status:'pending'
            });
            bids.sort((a, b) => b.amount - a.amount);
            if (bids.length > 0) {
                const highestBid = bids[0]; 
                await Bid.updateMany(
                    { _id: { $in: bids.map(bid => bid._id) } }, 
                    { $set: { status: 'rejected' } } 
                );
                await Bid.findByIdAndUpdate(highestBid._id, { $set: { status: 'accepted' } });
        }
        
            
    }res.json({ message: 'Bidding closed' });
        
    }catch(error){
        console.error('Error closing bid', error)
    }
}
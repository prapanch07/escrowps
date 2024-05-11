const Product = require('../models/product');
const User = require('../models/user');
const Settings = require('../models/generalsettingsmodel')

const Bidrooms = require('../models/bidRoommodel');
const Bid = require('../models/bidsmodel');
const Chatroom = require('../models/ChatRoommodel');
const Message = require('../models/MessageModel');
const Cart = require('../models/cartmodel');
const Purchasecart = require('../models/purchasecartmodel');


exports.fetchProducts = async(req, res, next) => {
    try{
        const products = await Product.find({deleted:false}).populate('seller');
        res.status(200).json(products);
    }catch(error){
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.delProduct = async(req, res, next) => {
    try{
        const productId = req.params.productId;
        const product = await Product.findById(productId);
        product.deleted=true;
        product.allow_bids=false;
        product.save();
        res.status(200).json({ message: 'Product deleted successfully' });
    }catch(error){
        console.error("Error deleting product");
        res.status(500).json({ error: 'Internal server error' });
    }
}



// users
exports.fetchusers = async(req, res, next) => {
    try{
        const users = await User.find({deleted:false});
        // for (const u of users){
        //     u.deleted=false;
        //     u.save()
        // }
        // console.log(users)
        res.status(200).json(users);
    }catch(error){
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.deleteUser = async(req, res, next) => {
    try{
        const user_id = req.params.user_id;
        const user = await User.findById(user_id);
        user.deleted=true;
        user.save();

        if (user.isSeller){
            console.log('user is seller');
            const products = await Product.find({seller:user_id});
            for (const product of products){
                product.deleted=true;
                product.allow_bids=false;
                // product.save()
            }
        }
        res.status(200).json({ message: 'user deleted successfully' });
    }catch(error){
        console.error("Error deleting user");
        res.status(500).json({ error: 'Internal server error' });
    }
}


exports.changeDay = async(req, res, next) => {
    const setting = await Settings.findOne()
    
    if (setting) {
        setting.biddingDay=req.body.day;
        setting.dayInText=req.body.dayintext;
        await setting.save();
        res.status(200).json({ message: 'Bidding day updated successfully' });
    } else {
        const setting = await Settings.create({ biddingDay:  req.body.day}); 
        res.status(201).json({ message: 'Bidding day created successfully' });
    }
}

exports.changestarttime =async(req, res, next)=>{
    console.log('req.body', req.body)
    const setting = await Settings.findOne()
    if (setting) {
        setting.bid_startingTime=req.body.time;
        await setting.save();
        res.status(200).json({ message: 'Bidding time updated successfully' });
    }
}

exports.changeclosetime =async(req, res, next)=>{
    console.log('req.body', req.body)
    const setting = await Settings.findOne()
    if (setting) {
        setting.bid_closingTime=req.body.time;
        await setting.save();
        res.status(200).json({ message: 'Bidding time updated successfully' });
    }
}


exports.currentbidDay = async(req, res, next)=>{
    const setting = await Settings.findOne()
    if (!setting) {
        const setting = await Settings.create({ 
            biddingDay:  1, dayInText:'Sunday', bid_startingTime: 8, bid_closingTime: 22}); 
        
    }
    res.status(200).json(setting)
}

exports.delAll = async (req, res, next) => {
    try {
        await Bidrooms.deleteMany();
        await Bid.deleteMany();
        await Chatroom.deleteMany();
        await Message.deleteMany();
        await Cart.deleteMany();
        await Purchasecart.deleteMany();
        const product = await Product.find()
        for (const p of product){
            p.allow_bids=false;
            p.isSold=false;
            p.save()
            
        }
        
        res.status(200).json({ message: 'All data deleted successfully' });
    } catch (error) {
        console.error("Error in deleting data", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}




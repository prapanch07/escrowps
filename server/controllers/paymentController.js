const Product = require('../models/product');
const Cart = require('../models/cartmodel');
const PurchaseCart = require('../models/purchasecartmodel');
const BidRoom = require('../models/bidRoommodel');
const User = require('../models/user')
const Bid = require('../models/bidsmodel');
const product = require('../models/product');

exports.payBidCart = async(req, res, next) => {
    try{
        console.log('payBidCart:',req.body)
        const cart_id = req.body.cart_id;
        const cart = await Cart.findById(cart_id);
        console.log(cart);
        cart.status = 'purchased';
        cart.save();
    } catch (error){
        console.error("Error in payment")
    }
}

exports.payNormalCart = async(req, res, next) => {
    try{
        console.log('payNormalCart:',req.body);
        const cart_id = req.body.cart_id;
        const cart = await PurchaseCart.findById(cart_id).populate('product');
        cart.status = 'purchased';
        const p = cart.product;
        p.isSold=true;
        p.save()
        cart.save()
        
    } catch (error){
        console.error("Error in payment")
    }
}

exports.bookBid = async(req, res, next) => {
    try{
        console.log('bookBid:',req.body);
        const bidroomId = req.body.bidroomId;
        const userId = req.body.userId;
        const bidRoom = await BidRoom.findById(bidroomId);
        console.log(bidRoom);
        console.log(userId);
        if (!bidRoom.participants.includes(userId)) {
            bidRoom.participants.push(userId);
            
        }
        console.log(bidRoom);
        bidRoom.save()
        res.status(200).json({ message: 'Bid booked successfully', bidRoom });
    } catch (error){
        console.error("Error in payment")
    }
}

exports.makeSubscriber = async(req, res, next) => {
    try{
        console.log('req.body',req.body);
        const userId = req.body.userId;
        const user = await User.findById(userId);
        console.log(user.subscriber);
        user.subscriber = true;
        user.save()
        res.status(200).json({ success: true, message: "User subscription status updated" });
        
    }catch(error){
        console.error("Error in subscription", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

exports.bidpurchase = async(req, res, next) => {
    try{
        console.log('req.body',req.body.bidId);
        const bid = await Bid.findById(req.body.bidId)
        console.log(bid)
        bid.payment = true;
        bid.save();
        res.status(200).json({ success: true, message: "User subscription status updated" });
    }catch(error){
        console.error("Error in bidpurchase", error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

exports.creatBidroom =async(req, res, next)=>{
    try{
        const br = await BidRoom.find();
        console.log('existing br: ',br)
        const productid=req.body.productid
        let biddingDate = new Date(req.body.biddingdate);
        biddingDate.setDate(biddingDate.getDate() + 1);
        const openingBid=req.body.openingBid
        const product=await Product.findById(productid);
        product.allow_bids=true;
        product.save()
        const sellerId=product.seller
        const bidroom = new BidRoom({
            openig_bid: openingBid,
            product: productid,
            bidding_date: biddingDate,
            participants: [sellerId],
        })
        console.log('bidroom',bidroom)
        bidroom.save()
        res.status(200).json({ success: true, message: "Bidrrom Created"});
    }catch(error){
        console.error("Error creating bidrrom", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

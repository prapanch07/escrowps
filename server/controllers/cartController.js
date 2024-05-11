const Cart = require('../models/cartmodel');
const PurchaseCart = require('../models/purchasecartmodel');
const Bid = require('../models/bidsmodel')
const Product = require('../models/product');
const User = require('../models/user');
const purchasecartmodel = require('../models/purchasecartmodel');

exports.fetch_cart = async(req, res, next) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const bids = await Bid.find({ customer: userId, status: 'accepted' });
        const bidIds = bids.map(bid => bid._id);
        const carts = await Cart.find({ bid: { $in: bidIds } })
          .populate({
            path: 'bid',
            populate: [
              {
                path: 'product',
                populate: {
                  path: 'seller'
                }
              },
              {
                path: 'customer'
              }
            ]
          })
          .sort({ createdAt: -1 });


        res.json(carts);
    } catch (error) {
        console.error("Error fetching carts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


exports.create_pur_cart = async(req, res, next) => {
  const userId = req.body.userId;
  const productId = req.body.productId;
  try {
    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }
    const cart = new PurchaseCart({
      user: userId,
      product: productId
    });
    await cart.save();
    res.status(201).json({ message: "Purchase cart created successfully", cart });
  } catch (error) {
    console.log("Error adding to cart:", error)
  }
}
  

exports.fetchPurCart = async(req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log(userId)
    const carts = await PurchaseCart.find({user:userId})
      .populate({
        path: 'product',
        populate:{
          path: 'seller',
          model: 'User'
        }
      })
      .sort({ createdAt: -1 }); 
    console.log(carts)
    res.json(carts);
  } catch (error) {
    console.error("Error adding to cart:", error)
  }
}


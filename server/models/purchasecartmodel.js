const mongoose = require('mongoose');
const user = require('./user');
const Product = require('./product');

const purchasecartSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'purchased'],
        default: 'pending'
    }


});

module.exports = mongoose.model('PurchaseCart', purchasecartSchema);
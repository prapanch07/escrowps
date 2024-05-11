const mongoose = require('mongoose');

const bidRoomSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    updateAt:{
        type: Date,
        default: Date.now,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }],
    open:{
        type: Boolean,
        default: false
    },
    closed:{
        type: Boolean,
        default: false
    },
    bidding_date:{
        type: Date, required: false
    },
    openig_bid: {
        type: Number,
        required: false
    }
});

module.exports = mongoose.model('BidRoom', bidRoomSchema);
const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    bidRoom: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'BidRoom',
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    payment:{
        type: Boolean, default: false
    }
});

module.exports = mongoose.model('Bid', bidSchema);

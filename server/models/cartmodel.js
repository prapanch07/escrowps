const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    bid : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid',
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

module.exports = mongoose.model('Cart', cartSchema);
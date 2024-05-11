const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    biddingDay: {
        type: Number, default: 1
    },
    dayInText: {
        type: String, default: 'Sunday'
    }, 
    bid_startingTime: {
        type: Number, default: 8
    },
    bid_closingTime: {
        type: Number, default: 22
    }
});

module.exports = mongoose.model('Settings', settingsSchema);
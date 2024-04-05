const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String, required: true
    },
    description: {
        type: String, required: true
    },
    price: {
        type: Number, required: true
    },
    category: {
        type: String, required: false
    },
    brand: {
        type: String, required: true
    },
    quantity_left: {
        type: Number, required: true 
    },
    image: {
        type: String, required: true
    },
    ratings: {
        type: Number, default: 0
    },
    createdAt: {
        type: Date, default: Date.now
    },
    updatedAt: {
        type: Date, default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
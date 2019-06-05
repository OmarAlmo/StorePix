const mongoose = require('mongoose');

const Picture = new mongoose.Schema({
    description: {
        type: [String],
        required: true
    },
    user: {
        type: User,
        required: true
    },
    price: {
        type: Number,
        default: Date.now
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Picture = mongoose.model('Picture', Picture);

module.exports = Picture;
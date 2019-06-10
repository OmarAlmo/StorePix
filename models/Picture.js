const mongoose = require('mongoose');

const PictureSchema = new mongoose.Schema({
    img: {
        fieldID: mongoose.Schema.Types.ObjectId,
        contentType: String,
        filenName: String
    },
    description: {
        type: [String],
        required: true
    },
    userEmail: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Picture = mongoose.model('Picture', PictureSchema);

module.exports = Picture;
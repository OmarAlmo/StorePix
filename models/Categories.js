const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    }
});

const Categories = mongoose.model("Categories", categorySchema);

module.exports = Categories;
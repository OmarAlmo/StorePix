const express = require('express');
const router = express.Router();
const csv = require('fast-csv');

const Category = require('../models/Categories');
var newCategory = new Category({});

var categoriesArray = [];

// Import from CSV
// module.exports = function () {
//     csv
//         .fromPath("../assets/cvs/categories.csv")
//         .on("data", function (data) {
//             // console.log(data);
//             newCategory.name = data.toString();
//             categoriesArray.push(newCategory.name);
//             newCategory.save().then(console.log('Category Added Successfully.'))
//             console.log(newCategory.name);
//         })
//         .on("end", function () {
//             console.log("done");
//         });
// }();

module.exports = function checkCategories() {
    var categories = document.getElementsByName('category');
    var selectedCategories = [];

    for (var i = 0; i < categories.length; i++) {
        if (categories[i].type == 'checkbox' && categories[i].checked == true)
            selectedCategories.push(categories[i].value);
    }

    if (selectedCategories.length < 2) {
        return false;
    } else {
        return true;
    }

}
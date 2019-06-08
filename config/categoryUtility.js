const express = require('express');
const router = express.Router();
const csv = require('fast-csv');
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;
const {
    window
} = new JSDOM(`<!DOCTYPE html>`);
const $ = require("jquery");

const Category = require('../models/Category');
var newCategory = new Category({});

var categoriesArray = [];

// Import from CSV
module.exports = function () {
    csv
        .fromPath("../assets/cvs/categories.csv")
        .on("data", function (data) {
            // console.log(data);
            newCategory.name = data.toString();
            categoriesArray.push(newCategory.name);
            newCategory.save().then(console.log('Category Added Successfully.'))
            console.log(newCategory.name);
        })
        .on("end", function () {
            console.log("done");
        });
}();


//Export to views
$(document).ready(function () {
    var categoryCheckboxes = document.getElementById('categoryCheckboxes');

    module.exports = function populateCheckboxes(array) {
        for (var i = 0; categoriesArray.length; i++) {

            var checkbox = document.createElement('input');
            var label = document.createElement("label");

            checkbox.type = "checkbox";
            checkbox.value = categoriesArray[i];
            checkbox.name = "category";

            categoryCheckboxes.appendChild(checkbox);
            categoryCheckboxes.appendChild(label);
            categoryCheckboxes.appendChild(document.createTextNode(categoriesArray[i]));
        }
    };
})
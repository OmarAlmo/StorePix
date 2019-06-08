const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const {
    ensureAuthenticated
} = require('../config/passport');

const Picture = require('../models/Picture');
const User = require('../models/User');

// Multer Image handling and uploading
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        fileTypeVeryfier(file, cb);
    }
}).single('picture');

function fileTypeVeryfier(file, cb) {
    const fileTypes = /jpg|jpg|png/;
    const extention = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (fileTypes) {
        return cb(null, true);
    } else {
        cb('Error: image is not valid');
    }
}

// save current user for access
let currentUser;

// GET dashboard
router.get('/dashboard', ensureAuthenticated, function (req, res) {
    res.render('dashboard');
    currentUser = req.user;
    console.log(req.user);
});

// POST 
router.post('/upload', function (req, res) {
    upload(req, res, (err) => {
        if (err) {
            res.render('dashboard', {
                msg: err
            });

        } else {
            const newPicture = new Picture({
                price: req.body.price,
                description: req.body.category,
                user: currentUser
            });
            newPicture.img.data = fs.readFileSync(req.file.path);
            newPicture.img.contentType = 'image/png';
            console.log(newPicture.img.buffer);
            newPicture.save().then(console.log("Picture added to DB successfully."))

            res.render('dashboard', {
                file: `../assets/uploads/${req.file.filename}`

            })
        }
    })
});

module.exports = router;
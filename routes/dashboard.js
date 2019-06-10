const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream');
const {
    ensureAuthenticated
} = require('../config/passport');


const Picture = require('../models/Picture');
const User = require('../models/User');

// Multer Image handling and uploading
const multer = require("multer");
const storage = new GridFsStorage({
    url: process.env.MongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
            };
            resolve(fileInfo);
        });
    }
});

const upload = multer({
    storage: storage
});

// Initialize image stream
const conn = mongoose.createConnection(process.env.MongoURI);
var gfs;
conn.once('open', function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
    // all set!
})

// save current user for access
let currentUser;

//
exports.fetchPictures = function (req, res) {
    Picture.find({}, {}, function (err, docs) {
        res.render('dashboard', {
            "Pictures": docs
        });
    });
};


// GET dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    currentUser = req.user;

    gfs.files.find().toArray((err, files) => {
        Picture.find({}, {}, function (err, docs) {
            if (!files || files.length === 0) {
                res.render('dashboard', {
                    files: false
                });
            } else {
                files.map(file => {
                    if (file.contentType === 'image/jpeg' ||
                        file.contentType === 'image/jpg' ||
                        file.contentType === 'image/png'
                    ) {
                        file.isImage = true;
                    } else {
                        file.isImage = false;
                    }
                });
                res.render('dashboard', {
                    files: files,
                    "picturesLists": docs,
                    "user": currentUser
                });
            }
        });
    });
});


// POST 
router.post('/upload', upload.single('file'), function (req, res) {
    console.log(req.body);
    var errors = [];
    const {
        category,
        price
    } = req.body;

    pictureData = [req.body.category, req.body.price];

    console.log("CATEGORY LENGTH", req.body.category.length);
    console.log("CATEGORY", req.body.category);
    console.log("PRICE", req.body.price);
    console.log("REQ FILE BOOL", req.file == null);
    console.log("REQ FILENAME", req.file.filename);
    console.log("REQ FILE", req.file);

    if (req.file == null || !req.body.category || !req.body.price) {
        errors.push({
            msg: "All fields must be completed"
        })
    }
    if (req.body.price < 0) {
        errors.push({
            msg: "Price is not valid"
        })
    }
    if (req.body.category.length < 2) {
        errors.push({
            msg: "Minimum of 2 categories required"
        })
    }

    if (errors.length > 0) {
        res.redirect('dashboard', {
            errors
        })
    } else {
        const newPicture = new Picture({
            price: req.body.price,
            description: req.body.category,
            userEmail: currentUser.email
        });
        newPicture.img.fieldID = req.file.id;
        newPicture.img.contentType = req.file.mimetype;
        newPicture.img.fileName = req.file.filename;

        newPicture.save().then(console.log("Picture added to DB successfully."))
        res.redirect('dashboard');
    }
});

//To render images
router.get('/pictures/:filename', (req, res) => {
    gfs.files.findOne({
        filename: req.params.filename
    }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }

        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                err: 'Not an image'
            });
        }
    });
});


router.get('/mypix', (req, res) => {

    res.render('mypix');
})

module.exports = router;
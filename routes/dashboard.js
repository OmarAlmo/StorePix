const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
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
const conn = mongoose.createConnection(process.env.MongoURI, {
    useNewUrlParser: true
});
var gfs;
conn.once('open', function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})

let currentUser;

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
                    "user": currentUser,
                });
            }
        });
    });

});

// POST 
categoryUtility = require('../config/categoryUtility');
router.post('/upload', upload.single('file'), function (req, res) {
    var errors = [];

    if (req.file == null || !req.body.category || !req.body.price) {
        req.flash("error", "All fields must be completed.");
        res.redirect('dashboard');
    }
    if (req.body.price < 0) {
        req.flash("error", "Price is not valid.");
        res.redirect('dashboard');
    }
    if (!categoryUtility.checkCategories) {
        req.flash("error", "Minimum of 2 categories must be selected.");
        res.redirect('dashboard');
    }

    const newPicture = new Picture({
        price: req.body.price,
        description: req.body.category,
        userEmail: currentUser.email,
        userName: currentUser.name
    });
    newPicture.img.fieldID = req.file.id;
    newPicture.img.contentType = req.file.mimetype;

    newPicture.save().then(console.log("Picture added to DB successfully."))
    res.redirect('dashboard');

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
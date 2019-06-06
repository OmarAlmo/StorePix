const express = require('express');
const router = express.Router();
const {
    ensureAuthenticated
} = require('../config/passport');

const User = require('../models/User');


router.get('/', function (req, res) {
    res.render('index');
});

router.get('/dashboard', ensureAuthenticated, function (req, res) {
    res.render('dashboard');
});

module.exports = router;
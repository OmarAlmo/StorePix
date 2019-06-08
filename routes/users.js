const express = require('express');
const router = express.Router();
const validator = require("email-validator");
const passort = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/User');

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

// Authenticate sign in and sign in if successful
router.post('/login', function (req, res, next) {
    passort.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

// Registration
router.post('/register', function (req, res) {
    console.log(req.body);
    var errors = [];
    const {
        name,
        email,
        password,
        password_confirmation
    } = req.body;

    console.log(req.body);

    // Check fields
    if (!name || !email || !password || !password_confirmation) {
        errors.push({
            msg: "All fields must be completed."
        })
    }
    if (!validator.validate(email)) {
        errors.push({
            msg: "Email is not valid."
        })
    }
    if (password != password_confirmation) {
        errors.push({
            msg: "Passwords do not match."
        })
    }
    if (password.length < 8) {
        errors.push({
            msg: "Password must be minimum 8 characters long."
        })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors
        })
    } else {
        User.findOne({
                email: email
            })
            .then(user => {
                if (user) {
                    errors.push({
                        msg: "email is registered."
                    });
                    res.render('register', {
                        errors
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    bcrypt.hash(newUser.password, saltRounds, function (err, hash) {
                        if (err) {
                            throw err;
                        } else {
                            newUser.password = hash;
                            newUser.save()
                                .then(console.log('User registered successfully.'))
                            res.redirect('/dashboard');
                        }
                    });
                }
            })
    }
})

module.exports = router;
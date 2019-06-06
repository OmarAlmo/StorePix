const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');

module.exports = passport.use(new localStrategy(
    function (email, password, done) {
        User.findOne({
            email: email
        }, function (err, user) {
            if (err) {
                return done({
                    message: "User not exist"
                }, err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Email is incorrect.'
                });
            }

            bcrypt.compare(password, user.password, function (err, res) {
                if (err) {
                    return done(null, false, {
                        message: 'Password is incorrect.'
                    });
                }
            });

            return done(null, user);
        })
    }
));
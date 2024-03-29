const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const helmet = require('helmet')


require('dotenv').config();

const app = express();

// Helmet
app.use(helmet())

// Addition app configs
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(flash());
app.use(bodyParser.urlencoded({
    extended: true
}));
// Trust proxy just in case for secure session to be accepted
app.set('trust proxy', 1)
app.use(
    session({
        secure: true,
        secret: 'storepix',
        resave: false,
        saveUninitialized: false
    })
);


// Global var
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// Create and connect to db
const connection = mongoose
    .connect(process.env.MongoURI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(res => {
        console.log("Database connected.");
        console.log("db connection state: ", mongoose.connection.readyState);
    })
    .catch(err => console.log(err));

// Passport initializer
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

// View engine
app.use(expressLayout);
app.set('view engine', 'ejs')

// static pages (home and register/ login)
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/', require('./routes/dashboard'));


// Route
const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log('Server started on port 8000'));
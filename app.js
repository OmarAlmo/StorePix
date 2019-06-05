const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();


// Create db
const db = require('./config/keys').MongoURI;

// Connect to db
mongoose
    .connect(
        db, {
            useNewUrlParser: true
        }
    )
    .then(console.log('Connection to db successful'))
    .catch(err => console.log(err));

// View engine
app.use(expressLayout);
app.set('view engine', 'ejs')

// static pages (home and sign up/ sign in)
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Route
const PORT = 8000;
app.listen(PORT, console.log('Server started on port 8000'));
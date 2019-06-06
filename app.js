const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
require('dotenv').config();

const app = express();

// Additional configurations
app.use(bodyParser.urlencoded({
    extended: true
}));

// Create and connect to db
const db = require('./config/keys').MongoURI;

mongoose
    .connect(db, {
        useNewUrlParser: true,
    })
    .then(res => {
        console.log("Database connected.");
        console.log("db connection state: ", mongoose.connection.readyState);
    })
    .catch(err => console.log(err));

// View engine
app.use(expressLayout);
app.set('view engine', 'ejs')

// static pages (home and register/ login)
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Route
const PORT = 8000;
app.listen(PORT, console.log('Server started on port 8000'));
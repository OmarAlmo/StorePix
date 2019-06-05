const express = require('express');
const expressLayout = require('express-ejs-layouts');


const app = express();

// Create db
const connectionSTR = {
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port
};

const initOptions = {
    schema: "StorePix"
};
const pgp = require('pg-promise')(initOptions);
const db = pgp(connectionSTR);

// View engine
app.use(expressLayout);
app.set('view engine', 'ejs')

// static pages (home and sign up/ sign in)
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Route
const PORT = 8000;
app.listen(PORT, console.log('Server started on port 8000'));
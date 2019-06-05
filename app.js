const express = require('express');
const expressLayout = require('express-ejs-layouts');
require('dotenv').config();
const {
    Client
} = require('pg');

const app = express();


// Create db
const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    currentSchema: 'StorePix'
})

// Connect Client
function connectClient() {
    console.log("started");
    client.connect(err => {
        if (err) {
            console.error('client connection error.\n', err.stack);
        } else {
            console.log('Database connection SUCCESSFUL');
        }
    });
}
//Disconnect Client
function disconnectClient() {
    client.end();
}

// View engine
app.use(expressLayout);
app.set('view engine', 'ejs')

// static pages (home and sign up/ sign in)
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Route
const PORT = 8000;
app.listen(PORT, console.log('Server started on port 8000'));
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const app = express();


// View engine
app.use(expressLayout);
app.set('view engine', 'ejs')

// static pages (home and sign up/ sign in)
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Route
const PORT = 8000;
app.listen(PORT, console.log('Server started on port 8000'));
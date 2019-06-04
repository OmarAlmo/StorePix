const express = require('express');
const app = express();


// Index home page
app.use('/', require('./routes/index'));

// Route
const PORT = 8000;
app.listen(PORT, console.log('Server started on port 8000'));
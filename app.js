const express = require('express');


const app = express();

// Body parser
app.use(express.json({limit: '10kb'}));

module.exports = app;
const express = require('express');
const authRoutes = require('./routes/auth.routes');
const globalErrorHandler = require('./controllers/errorController')

const app = express();

// Body parser
app.use(express.json({limit: '10kb'}));


app.use('/api/v1/auth', authRoutes);

//Global error handler
app.use(globalErrorHandler);

module.exports = app;
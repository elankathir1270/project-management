const express = require('express');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes')
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.route');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controllers/errorController')

const app = express();

//Body parser
app.use(express.json({limit: '10kb'}));

//Cookie Parser
app.use(cookieParser());


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);

//Global error handler
app.use(globalErrorHandler);

module.exports = app;
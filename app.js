const express = require('express');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes')
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.route');
const activityRoutes = require('./routes/activity.routes');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controllers/errorController');
const path = require('path');

const app = express();

//Body parser
app.use(express.json({limit: '10kb'}));

//Cookie Parser
app.use(cookieParser());

//To access uploaded file from FE
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/activity', activityRoutes);

//Global error handler
app.use(globalErrorHandler);

module.exports = app;
const express = require('express');

const taskController = require('./../controllers/taskController');
const authMiddleware = require('./../middlewares/auth.middleware');
const authorizeRole = require('./../middlewares/role.middleware');

const taskRouter = express.Router();

taskRouter.route('/')
.post(authMiddleware, authorizeRole('admin', 'manager'), taskController.createTask);

taskRouter.route('/project/:projectId')
.get(authMiddleware, taskController.getProjectTasks);

taskRouter.route('/:taskId/status')
.patch(authMiddleware, authorizeRole('developer'), taskController.updateTaskStatus);

module.exports = taskRouter;
const express = require('express');
const authMiddleware = require('./../middlewares/auth.middleware');
const activityController = require('./../controllers/activityController');

const activityRouter = express.Router();

activityRouter.route('/project/:projectId')
.get(authMiddleware, activityController.getProjectActivityLogs);


module.exports = activityRouter;

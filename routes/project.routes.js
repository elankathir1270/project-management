const express = require('express');
const projectController = require('./../controllers/projectController');
const authMiddleware = require('./../middlewares/auth.middleware');
const authorizeRole = require('./../middlewares/role.middleware');

const projectRouter = express.Router();

projectRouter.route('/')
.post(authMiddleware, authorizeRole('admin','manager'), projectController.createProject)
.get(authMiddleware, projectController.getProjects);

projectRouter.route('/:projectId/members')
.patch(authMiddleware, authorizeRole('admin','manager'), projectController.addMember)
.delete(authMiddleware, authorizeRole('admin','manager'), projectController.removeMember);

module.exports = projectRouter;
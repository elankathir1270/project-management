const express = require('express');
const userController = require('./../controllers/userController');
const authMiddleware = require('./../middlewares/auth.middleware');

const userRouter = express.Router();

// Protected route
userRouter.route('/me').get(authMiddleware, userController.getMe);

module.exports = userRouter;
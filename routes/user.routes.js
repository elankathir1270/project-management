const express = require('express');
const userController = require('./../controllers/userController');
const authMiddleware = require('./../middlewares/auth.middleware');

const router = express.Router();

// Protected route
router.get('/me', authMiddleware, userController.getMe);

module.exports = router;
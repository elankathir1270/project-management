const express = require("express");
const authController = require("./../controllers/authController");
const validate = require("./../middlewares/validate.middleware");
const {
  registerSchema,
  loginSchema,
} = require("./../validations/auth.validation");

const authRouter = express.Router();

authRouter
  .route("/register")
  .post(validate(registerSchema), authController.register);
authRouter.route("/login").post(validate(loginSchema), authController.login);
authRouter.route("/logout").post(authController.logout);

authRouter.route("/refresh-token").post(authController.refreshToken);

module.exports = authRouter;

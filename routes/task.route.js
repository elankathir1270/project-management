const express = require("express");

const taskController = require("./../controllers/taskController");
const authMiddleware = require("./../middlewares/auth.middleware");
const authorizeRole = require("./../middlewares/role.middleware");
const validate = require("./../middlewares/validate.middleware");
const {
  createTaskSchema,
  updateTaskStatusSchema,
} = require("./../validations/task.validation");
const validateObjectId = require("./../middlewares/objectId.middleware");

const taskRouter = express.Router();

taskRouter
  .route("/")
  .post(
    authMiddleware,
    authorizeRole("admin", "manager"),
    validate(createTaskSchema),
    taskController.createTask,
  );

taskRouter
  .route("/project/:projectId")
  .get(
    authMiddleware,
    validateObjectId("projectId"),
    taskController.getProjectTasks,
  );

taskRouter
  .route("/:taskId/status")
  .patch(
    authMiddleware,
    authorizeRole("developer"),
    validate(updateTaskStatusSchema),
    validateObjectId("taskId"),
    taskController.updateTaskStatus,
  );

module.exports = taskRouter;

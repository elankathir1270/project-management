const express = require("express");
const projectController = require("./../controllers/projectController");
const authMiddleware = require("./../middlewares/auth.middleware");
const authorizeRole = require("./../middlewares/role.middleware");
const validate = require("./../middlewares/validate.middleware");
const {
  createProjectSchema,
  addMemberSchema,
} = require("./../validations/project.validation");
const validateObjectId = require('./../middlewares/objectId.middleware');

const projectRouter = express.Router();

projectRouter
  .route("/")
  .post(
    authMiddleware,
    authorizeRole("admin", "manager"),
    validate(createProjectSchema),
    projectController.createProject,
  )
  .get(authMiddleware, projectController.getProjects);

projectRouter
  .route("/:projectId/members")
  .patch(
    authMiddleware,
    authorizeRole("admin", "manager"),
    validate(addMemberSchema),
    validateObjectId("projectId"),
    projectController.addMember,
  )
  .delete(
    authMiddleware,
    authorizeRole("admin", "manager"),
    validateObjectId("projectId"),
    projectController.removeMember,
  );

module.exports = projectRouter;

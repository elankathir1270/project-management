const catchAsync = require("./../utilities/catchAsync");
const projectService = require("./../services/project.service");

//Create Project
exports.createProject = catchAsync(async (req, res) => {
  const project = await projectService.createProject(req.body, req.user.userId);

  res.status(201).json({
    status: "success",
    data: project,
  });
});

//Get Projects
exports.getProjects = catchAsync(async (req, res) => {
  const projects = await projectService.getProjects(req.user.userId);

  res.status(200).json({
    success: "success",
    data: projects,
  });
});

//Add Member
exports.addMember = catchAsync(async (req, res) => {
  const project = await projectService.addMember(
    req.params.projectId,
    req.body.memberId,
  );

    res.status(200).json({
      success: "success",
      data: project,
    });
});

//Remove Member
exports.removeMember = catchAsync(async (req, res) => {
    const project = await projectService.removeMember(
        req.params.projectId,
        req.body.memberId
    );

    res.status(200).json({
        status: "success",
        data: project
    });
});

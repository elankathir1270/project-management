const catchAsync = require("./../utilities/catchAsync");
const taskService = require("./../services/task.service");

//Create task
exports.createTask = catchAsync(async (req, res) => {
  const task = await taskService.createTask(req.body, req.user.userId);

  res.status(201).json({
    status: "success",
    data: task,
  });
});

//Get project tasks
exports.getProjectTasks = catchAsync(async (req, res) => {
  const tasks = await taskService.getProjectTasks(
    req.params.projectId,
    req.user.userId,
    req.query,
  );

  res.status(200).json({
    status: "success",
    data: tasks,
  });
});

//Update status
exports.updateTaskStatus = catchAsync(async (req, res) => {
  const task = await taskService.updateTaskStatus(
    req.params.taskId,
    req.body.status,
    req.user.userId,
  );

  res.status(200).json({
    status: "success",
    data: task,
  });
});

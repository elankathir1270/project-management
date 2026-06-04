const Task = require("./../models/task");
const Project = require("./../models/project");
const ApiError = require("./../utilities/apiError");
const ApiFeatures = require("./../utilities/apiFeatures");
const { getIo } = require("./../config/socket");
const { createActivityLog } = require("./../services/activity.service");
const {
  getCache,
  setCache,
  deleteCache,
  deleteCacheByPattern,
} = require("./../utilities/cache");

//Create Task
const createTask = async (data, userId) => {
  const project = await Project.findById(data.projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  //Assigned user must belong to project
  if (data.assignedTo && !project.members.includes(data.assignedTo)) {
    throw new ApiError(400, "Assigned user is not a project member");
  }

  const task = await Task.create({
    ...data,
    createdBy: userId,
  });

  await deleteCacheByPattern(`tasks:${data.projectId}:*`);

  //Emit real-time notification
  if (task.assignedTo) {
    const io = getIo();

    io.to(task.assignedTo.toString()).emit("taskAssigned", {
      message: `New task assigned: ${task.title}`,
      task,
    });
  }

  await createActivityLog({
    action: "TASK_CREATED",
    message: `Task ${task.title} created`,
    performedBy: userId,
    project: task.projectId,
    task: task._id,
  });

  return task;
};

//Get tasks by project Id
const getProjectTasks = async (projectId, userId, queryParams) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  //Only project members can access
  if (!project.members.includes(userId)) {
    throw new ApiError(403, "You are not a member of this project");
  }

  //Cache key
  const cacheKey = `tasks:${projectId}:${JSON.stringify(queryParams)}`;

  //Cached Tasks
  const cachedTasks = await getCache(cacheKey);

  if (cachedTasks) {
    return cachedTasks;
  }

  //Base query
  const mongoQuery = Task.find({ projectId: projectId })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name");

  const features = new ApiFeatures(mongoQuery, queryParams)
    .search()
    .filter()
    .sort()
    .paginate()
    .limitFields();

  const tasks = await features.query;

  // Total count
  const totalTasks = await Task.countDocuments({
    projectId: projectId,
  });

  const result = {
    total: totalTasks,
    count: tasks.length,
    page: Number(queryParams.page) || 1,
    tasks,
  };

  //Store in redis cache
  await setCache(cacheKey, result, 300);

  return result;
};

//Update task status
const updateTaskStatus = async (taskId, status, userId) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  //Only assigned developers can update
  if (task.assignedTo.toString() !== userId) {
    throw new ApiError(403, "You can only update your own task");
  }

  const oldStatus = task.status;
  task.status = status;

  await task.save();

  await deleteCacheByPattern(`tasks:${data.projectId}:*`);

  //Emit real-time notification
  const io = getIo();
  io.to(task.assignedTo.toString()).emit("taskStatusUpdated", {
    message: `Task "${task.title}" updated to ${status}`,
    task,
  });

  await createActivityLog({
    action: "TASK_STATUS_UPDATED",
    message: `Task ${task.title} status updated`,
    performedBy: userId,
    project: task.projectId,
    task: task._id,
    metadata: {
      oldStatus,
      newStatus: status,
    },
  });

  return task;
};

//Upload attachment
const uploadAttachment = async (taskId, file, userId) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const project = await Project.findById(task.project);

  if (!project.members.includes(userId)) {
    throw new ApiError(403, "You are not a member of this project");
  }

  task.attachments.push({
    fileName: file.filename,
    fileUrl: `/uploads/attachments/${file.filename}`,
    uploadedBy: userId,
  });

  await task.save();

  await deleteCacheByPattern(`tasks:${task.project}:*`);

  //Emit real-time notification
  const io = getIO();

  io.to(task.createdBy.toString()).emit("attachmentUploaded", {
    message: `New attachment added to task: ${task.title}`,
    task,
  });

  await createActivityLog({
    action: "ATTACHMENT_UPLOADED",
    message: `Attachment uploaded to task "${task.title}"`,
    performedBy: userId,
    project: task.projectId,
    task: task._id,
    metadata: {
      fileName: file.filename,
    },
  });

  return task;
};

module.exports = {
  createTask,
  getProjectTasks,
  updateTaskStatus,
  uploadAttachment,
};

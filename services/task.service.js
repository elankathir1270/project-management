const Task = require('./../models/task');
const Project = require('./../models/project');
const ApiError = require("./../utilities/apiError");

//Create Task
const createTask = async (data,userId) => {
    const project = await Project.findById(data.projectId);

    if(!project){
        throw new ApiError(404, "Project not found");
    }

    const task = await Task.create({
        ...data,
        createdBy: userId
    })

    return task;

}

//Get tasks by project Id
const getProjectTasks = async (projectId) => {
    const tasks = await Task.find({projectId : projectId})
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name')

    return tasks;
}

//Update task status
const updateTaskStatus = async (taskId,status,userId) => {
    const task = await Task.findById(taskId);

    if(!task) {
        throw new ApiError(404, "Task not found");
    }

    //Only assigned developers can update
    if(task.assignedTo.toString() !== userId){
        throw new ApiError(403, 'You can only update your own task');
    }

    task.status = status;

    await task.save();

    return task;

}

module.exports = {
  createTask,
  getProjectTasks,
  updateTaskStatus
};
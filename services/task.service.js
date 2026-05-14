const Task = require('./../models/task');
const Project = require('./../models/project');
const ApiError = require("./../utilities/apiError");

//Create Task
const createTask = async (data,userId) => {
    const project = await Project.findById(data.projectId);

    if(!project){
        throw new ApiError(404, "Project not found");
    }

    //Assigned user must belong to user
    if(data.assignedTo &&
        !project.members.includes(data.assignedTo)
    ){
        throw new ApiError(400, 'Assigned user is not a project member');
    }

    const task = await Task.create({
        ...data,
        createdBy: userId
    })

    return task;

}

//Get tasks by project Id
const getProjectTasks = async (projectId,userId) => {
    const project = await Project.findById(projectId);

    if(!project) {
        throw new ApiError(404, 'Project not found');
    }

    //Only project members can access
    if(!project.members.includes(userId)){
        throw new ApiError(403,  'You are not a member of this project');
    }

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
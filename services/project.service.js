const Project = require('./../models/project');
const ApiError = require("./../utilities/apiError");


//create projects
const createProject = async (data, userId) => {
    const project = await Project.create({
        ...data,
        createdBy: userId,
        members: [userId]
    })

    return project
}

//get all projects for logged in user
const getProjects = async (userId) => {
    return await Project.find({members : userId})
    .populate('members', 'name email role')
    .populate('createdBy', 'name email');
}

//add members to project
const addMember = async (projectId, memberId) => {
    const project = await Project.findById(projectId);

    if(!project) {
        throw new ApiError(404, "project not found");
    }

    //prevent duplicate member
    const memberExists = project.members.some(
        member => member.toString() === memberId
    );

    if (memberExists) {
        throw new ApiError(400, "Member already added to project");
    }

    project.members.push(memberId);
    await project.save();

    return project;
}


// Remove member from project
const removeMember = async (projectId, memberId) => {

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // check member exists
    const memberExists = project.members.some(
        member => member.toString() === memberId
    );

    if (!memberExists) {
        throw new ApiError(404, "Member is not part of this project");
    }

    // remove member
    project.members = project.members.filter(
        member => member.toString() !== memberId
    );

    await project.save();

    return project;
};
module.exports = {
    createProject,
    getProjects,
    addMember,
    removeMember
}
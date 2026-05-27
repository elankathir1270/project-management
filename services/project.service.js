const Project = require('./../models/project');
const ApiError = require("./../utilities/apiError");
const { createActivityLog } = require('./../services/activity.service');


//create projects
const createProject = async (data, userId) => {
    const project = await Project.create({
        ...data,
        createdBy: userId,
        members: [userId]
    });

    await createActivityLog({
        action: 'PROJECT_CREATED',
        message: `Project "${project.title}" created`,
        performedBy: userId,
        project: project._id
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

    await createActivityLog({
        action: 'MEMBER_ADDED',
        message: `New member added to project`,
        performedBy: project.createdBy,
        project: project._id,
        metadata: {memberId}
    })

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
const Joi = require('joi');


//Create Project
const createProjectSchema = Joi.object({
  title: Joi.string()
    .trim()
    .required(),

  description: Joi.string()
    .allow('')
});


//Add Member
const addMemberSchema = Joi.object({
  memberId: Joi.string()
    .length(24)
    .hex()
    .required()
});

module.exports = {
  createProjectSchema,
  addMemberSchema
};
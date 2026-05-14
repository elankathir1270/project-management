const Joi = require('joi');


//Create Task
const createTaskSchema = Joi.object({
  title: Joi.string()
    .required(),

  description: Joi.string()
    .allow(''),

  projectId: Joi.string()
    .length(24)
    .hex()
    .required(),

  assignedTo: Joi.string()
    .length(24)
    .hex()
});


//Update Status
const updateTaskStatusSchema = Joi.object({
  status: Joi.string()
    .valid('todo', 'inprogress', 'done')
    .required()
});

module.exports = {
  createTaskSchema,
  updateTaskStatusSchema
};
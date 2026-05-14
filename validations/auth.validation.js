const Joi = require('joi');


//Register Validation
const registerSchema = Joi.object({
  name: Joi.string().trim().required(),

  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required(),

  role: Joi.string()
    .valid('admin', 'manager', 'developer')
});


//Login Validation
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .required()
});

module.exports = {
  registerSchema,
  loginSchema
};
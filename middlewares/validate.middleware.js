const ApiError = require('./../utilities/apiError');


const validate = (schema) => {
    return (req,res,next) => {
        const {error} = schema.validate(req.body, {
            abortEarly: false, //to get all validation errors
            stripUnknown: true //removes fields not defined in schema
        });

        if (error) {

            const messages = error.details.map(
                (err) => err.message
            );

            return next(
                new ApiError(400, messages.join(', '))
            );
        }

        next();
    };
};

module.exports = validate;
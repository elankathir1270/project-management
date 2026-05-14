const mongoose = require('mongoose');
const ApiError = require('./../utilities/apiError');

const validateObjectId = (paramName) => {
    return (req,res,next) => {
        const value = req.params[paramName];

        if(!mongoose.Types.ObjectId.isValid(value)){
            return next(new ApiError(400, `Invalid ${paramName}`));
        };

        next();
    };
};


module.exports = validateObjectId;
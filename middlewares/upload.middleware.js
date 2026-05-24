const multer = require('multer');
const path = require('path');
const ApiError = require('./../utilities/apiError');


//Storage config
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'uploads/attachments')
    },

    filename: (req,file,cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);

        cb(null, uniqueName + path.extname(file.originalname));
    }
});


//Allowed file types
const allowedTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf'
];

//File filter
const fileFilter = (req,file,cb) => {
    if(!allowedTypes.includes(file.mimetype)){
        return cb(
            new ApiError(400,  'Only JPG, PNG and PDF files are allowed'),
            false
        );
    }
    cb(null, true);
}

//Multer upload
const upload = multer({
    storage,
    fileFilter,
    limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

module.exports = upload;

const { required } = require('joi');
const mongoose  = require('mongoose');


const activityLogSchema = mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true       
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    },
    metadata: {
        type: Object,
        default: {}
    } //this is to Flexible extra info.
},
{timestamps: true}
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
const catchAsync = require('./../utilities/catchAsync');
const ActivityLog = require('./../models/activityLog');

exports.getProjectActivityLogs = catchAsync( async(req,res) => {
    const logs = await ActivityLog.find({project: req.params.projectId})
    .populate('performedBy', 'name email role')
    .sort('-createdAt');

    res.status(200).json({
      status: "success",
      count: logs.length,
      data: logs
    });
})
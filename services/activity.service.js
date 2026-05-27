const ActivityLog = require("./../models/activityLog");

//Create activity log
const createActivityLog = async ({
  action,
  message,
  performedBy,
  project,
  task,
  metadata = {},
}) => {
  return ActivityLog.create({
    action,
    message,
    performedBy,
    project,
    task,
    metadata,
  });
};

module.exports = {createActivityLog};

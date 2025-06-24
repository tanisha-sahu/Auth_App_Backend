const Permission = require('../models/Permission');

exports.getAllPermissions = async () => {
  return await Permission.find().lean();
};

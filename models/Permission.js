const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  permission_name: String,
  route: String,
  module_name: String,
  type: String, 
});

module.exports = mongoose.model('Permission', PermissionSchema);

const Role = require('../models/Role');

exports.createRole = async ({ name, sidebarMenus, permissions }) => {
  const role = new Role({ name, sidebarMenus, permissions });
  await role.save();
  return role;
};

exports.getAllRoles = async () => {
  return await Role.find()
    .populate('sidebarMenus')
    .populate('permissions');
};

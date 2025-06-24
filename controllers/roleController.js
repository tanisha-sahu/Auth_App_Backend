const roleService = require('../services/role.service');

exports.create = async (req, res) => {
  try {
    const { name, sidebarMenus, permissions } = req.body;
    await roleService.createRole({ name, sidebarMenus, permissions });
    res.status(201).json({ message: 'Role created successfully' });
  } catch (err) {
    console.error('createRole error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAll = async (_req, res) => {
  try {
    const roles = await roleService.getAllRoles();
    res.json(roles);
  } catch (err) {
    console.error('getAllRoles error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

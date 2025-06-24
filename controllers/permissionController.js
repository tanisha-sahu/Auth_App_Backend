const permissionService = require('../services/permission.service');

exports.getAll = async (req, res) => {
  try {
    const permissions = await permissionService.getAllPermissions();
    res.json(permissions);
  } catch (err) {
    console.error('getAllPermissions error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

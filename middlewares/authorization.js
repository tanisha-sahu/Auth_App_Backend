const Employee = require('../models/Employee');
const Role     = require('../models/Role');

const authorization = async (req, res, next) => {
  try {
  
    const user = await Employee.findById(req.user.sub);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    // Load role & permissions
    const role = await Role.findById(user.role).populate('permissions', 'route');
    if (!role) {
      return res.status(403).json({ success: false, message: 'Role not found.' });
    }

    if (role.name === 'Admin') {
      return next();
    }

    if (!role.permissions.length) {
      return res.status(403).json({ success: false, message: 'No permissions assigned.' });
    }

    const allowedRoutes = role.permissions.map(p => p.route);

    const fullPath = (req.baseUrl + req.path).replace(/\/$/, '');

    const isAllowed = allowedRoutes.some(route =>
      fullPath.startsWith(route.replace(/\/$/, ''))
    );

    if (isAllowed) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'You are not authorized for this action.'
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = authorization;

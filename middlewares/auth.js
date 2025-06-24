require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'Secret');
    req.user = payload;
    next();
  } catch (err) {
    console.error('JWT verify failed:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

exports.requireRole = (allowedRoles = []) => (req, res, next) => {
  if (!req.user || !req.user.roleName || !allowedRoles.includes(req.user.roleName)) {
    return res.status(403).json({ message: 'Forbidden: insufficient privileges' });
  }
  next();
};

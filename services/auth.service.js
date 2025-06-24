const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const JWT_SECRET = process.env.JWT_SECRET || 'Secret';

exports.login = async ({ emailAddress, password, rememberMe }) => {
  if (!emailAddress || !password) {
    const err = new Error('Email and password are required');
    err.code = 400;
    throw err;
  }

  const emp = await Employee.findOne({ emailAddress }).populate('role', 'name');
  if (!emp || !(await emp.comparePassword(password))) {
    const err = new Error('Invalid credentials');
    err.code = 401;
    throw err;
  }

  const payload = {
    sub: emp._id,
    email: emp.emailAddress,
    roleId: emp.role._id,
    roleName: emp.role.name,
  };

  const expiresIn = rememberMe ? '7d' : '1h';
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn });

  return {
    accessToken: token,
    role: {
      id: emp.role._id,
      name: emp.role.name,
      email: emp.emailAddress,
    },
    expiresIn,
  };
};

exports.autoLogin = (authHeader) => {
  if (!authHeader?.startsWith('Bearer ')) {
    const err = new Error('No valid token provided');
    err.code = 401;
    throw err;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      const err = new Error('Token expired');
      err.code = 401;
      throw err;
    }

    return {
      accessToken: token,
      role: {
        id: payload.roleId,
        name: payload.roleName,
        email: payload.email,
      },
    };
  } catch (err) {
    const error = new Error('Invalid token');
    error.code = 401;
    throw error;
  }
};

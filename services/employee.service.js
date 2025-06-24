const Employee = require('../models/Employee');
const Role = require('../models/Role');

exports.createEmployee = async (data) => {
  const {
    firstName,
    lastName,
    mobileNumber,
    address,
    emailAddress,
    password,
    role: roleId,
  } = data;

  if (!firstName || !lastName || !mobileNumber || !address || !emailAddress || !password || !roleId) {
    throw new Error('All fields are required');
  }

  const roleDoc = await Role.findById(roleId);
  if (!roleDoc) throw new Error('Invalid role');

  const existing = await Employee.findOne({ emailAddress });
  if (existing) {
    const err = new Error('Email already registered');
    err.code = 409;
    throw err;
  }

  const newEmp = new Employee({
    firstName,
    lastName,
    mobileNumber,
    address,
    emailAddress,
    password,
    role: roleId,
  });
  await newEmp.save();
  await newEmp.populate('role', 'name');

  return newEmp;
};

exports.getAllEmployees = async () => {
  const employees = await Employee.find()
    .select('-password')
    .populate('role', 'name');
  return employees;
};

exports.editEmployee = async (empId, updates) => {
  const fields = ['firstName', 'lastName', 'mobileNumber', 'address', 'emailAddress', 'role'];
  const updateData = {};
  fields.forEach(f => {
    if (updates[f] !== undefined) updateData[f] = updates[f];
  });

  if (updates.password) {
    updateData.password = updates.password;
  }

  if (updateData.role) {
    const roleDoc = await Role.findById(updateData.role);
    if (!roleDoc) {
      throw new Error('Invalid role ID');
    }
  }

  const emp = await Employee.findById(empId);
  if (!emp) throw new Error('Employee not found');

  Object.assign(emp, updateData);
  await emp.save();

  await emp.populate('role', 'name');
  const empObj = emp.toObject();
  delete empObj.password;

  return empObj;
};

exports.deleteEmployee = async (empId) => {
  const emp = await Employee.findById(empId);
  if (!emp) throw new Error('Employee not found');

  await emp.deleteOne();
  return { message: 'Employee deleted' };
};

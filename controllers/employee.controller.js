const employeeService = require('../services/employee.service');

exports.createEmployee = async (req, res) => {
  try {
    const newEmp = await employeeService.createEmployee(req.body);
    res.status(201).json(newEmp);
  } catch (err) {
    console.error('createEmployee error:', err);
    const status = err.code === 409 ? 409 : 400;
    res.status(status).json({ message: err.message || 'Server error' });
  }
};

exports.getEmployeeList = async (req, res) => {
  try {
    const employees = await employeeService.getAllEmployees();
    res.json(employees);
  } catch (err) {
    console.error('getEmployeeList error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.editEmployee = async (req, res) => {
  try {
    const updatedEmp = await employeeService.editEmployee(req.params.id, req.body);
    res.json(updatedEmp);
  } catch (err) {
    console.error('editEmployee error:', err);
    const status = err.code === 11000 ? 409 : 400;
    res.status(status).json({ message: err.message || 'Server error' });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const result = await employeeService.deleteEmployee(req.params.id);
    res.json(result);
  } catch (err) {
    console.error('deleteEmployee error:', err);
    res.status(404).json({ message: err.message || 'Server error' });
  }
};

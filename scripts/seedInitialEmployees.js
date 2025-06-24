require('dotenv').config();
const mongoose  = require('mongoose');
const Role      = require('../models/Role');
const Employee  = require('../models/Employee');
const bcrypt    = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI;

async function hashIfPlain(emp) {
  if (typeof emp.password === 'string' && !emp.password.startsWith('$2')) {
    const newHash = await bcrypt.hash(emp.password, 10);
    emp.password = newHash;
    await emp.save();
  }
}

async function seed() {
  try {
    await mongoose.connect('mongodb+srv://tanishasahu205:p62Z8SKBcVAR7pOU@cluster0.4ouugzd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

    const adminRole   = await Role.findOne({ name: 'Admin' });
    const managerRole = await Role.findOne({ name: 'Manager' });
    if (!adminRole || !managerRole) {
      console.error('ERROR: You must have roles "Admin" and "Manager" in the roles collection.');
      process.exit(1);
    }

    const adminEmail = 'admin@gmail.com';
    let adminEmp = await Employee.findOne({ emailAddress: adminEmail });
    if (!adminEmp) {
      const hashed = await bcrypt.hash('123Abc!', 10);
      adminEmp = new Employee({
        firstName:    'Super',
        lastName:     'Admin',
        mobileNumber: '9999999999',
        address:      'HQ Address',
        emailAddress: adminEmail,
        password:     '123Abc!',
        role:         adminRole._id,
      });
      await adminEmp.save();
    } else {
      await hashIfPlain(adminEmp);
    }

    const managerEmail = 'manager@gmail.com';
    let managerEmp = await Employee.findOne({ emailAddress: managerEmail });
    if (!managerEmp) {
      const hashed = await bcrypt.hash('123Abc!', 10);
      managerEmp = new Employee({
        firstName:    'Project',
        lastName:     'Manager',
        mobileNumber: '8888888888',
        address:      'Branch Address',
        emailAddress: managerEmail,
        password:     '123Abc!',
        role:         managerRole._id,
      });
      await managerEmp.save();
    } else {
      await hashIfPlain(managerEmp);
    }

    process.exit(0);
  } catch (err) {
    console.error('Seed script error:', err);
    process.exit(1);
  }
}

seed();

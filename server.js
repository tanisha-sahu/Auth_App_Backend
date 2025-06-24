require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const sidebarmenusRoute = require('./routes/sidebarmenus');
const rolesRoute = require('./routes/roles');
const permissionsRoute = require('./routes/permissions');
const employeeAuthPublic = require('./routes/v1/public/employeeAuth.routes');
const employeePrivate = require('./routes/v1/private/employee.routes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use('/api/employee/auth', employeeAuthPublic);
app.use('/api/employees', employeePrivate);
app.use('/api/auth', authRoutes);
app.use('/api/sidebarmenus', sidebarmenusRoute);
app.use('/api/roles', rolesRoute);
app.use('/api/permissions', permissionsRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
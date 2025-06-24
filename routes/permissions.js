const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');

// GET /api/permissions
router.get('/', permissionController.getAll);

module.exports = router;

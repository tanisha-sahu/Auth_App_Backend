const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// POST /api/roles
router.post('/', roleController.create);

// GET /api/roles
router.get('/', roleController.getAll);

module.exports = router;

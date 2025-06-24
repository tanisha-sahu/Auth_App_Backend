const express = require('express');
const router = express.Router();
const sideBarMenuController = require('../controllers/sideBarMenuController');

// GET /api/sidebarmenus
router.get('/', sideBarMenuController.list);

module.exports = router;

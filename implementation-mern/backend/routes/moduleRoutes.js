const express = require('express');
const router = express.Router();
const { createModule, getModules } = require('../controllers/moduleController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Admin'), createModule);
router.get('/', protect, getModules);

module.exports = router;

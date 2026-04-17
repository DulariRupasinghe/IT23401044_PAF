const express = require('express');
const router = express.Router();
const { generateAttendancePDF } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/attendance/:moduleId', protect, authorize('Admin', 'Lecturer'), generateAttendancePDF);

module.exports = router;

const express = require('express');
const router = express.Router();
const { createSession, markAttendance, getModuleAnalytics } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/session', protect, authorize('Admin', 'Lecturer'), createSession);
router.post('/mark', protect, authorize('Student'), markAttendance);
router.get('/analytics/:moduleId', protect, getModuleAnalytics);

module.exports = router;

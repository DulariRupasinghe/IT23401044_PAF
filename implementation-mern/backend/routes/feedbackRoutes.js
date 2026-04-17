const express = require('express');
const router = express.Router();
const { submitFeedback, getModuleFeedback } = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Student'), submitFeedback);
router.get('/module/:moduleId', protect, getModuleFeedback);

module.exports = router;

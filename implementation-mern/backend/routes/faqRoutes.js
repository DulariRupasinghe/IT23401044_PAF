const express = require('express');
const router = express.Router();
const { getChatResponse, addFAQ, getAllFAQs } = require('../controllers/faqController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/chat', getChatResponse);
router.post('/', protect, authorize('Admin'), addFAQ);
router.get('/', getAllFAQs);

module.exports = router;

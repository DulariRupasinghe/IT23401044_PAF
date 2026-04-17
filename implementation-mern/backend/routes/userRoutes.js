const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getMe, 
    getAllUsers, 
    updateUser, 
    deleteUser 
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// Management Routes
router.get('/all', protect, authorize('Admin', 'Lecturer'), getAllUsers);
router.put('/:id', protect, authorize('Admin'), updateUser);
router.delete('/:id', protect, authorize('Admin'), deleteUser);

module.exports = router;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false // Hide password by default
    },
    role: {
        type: String,
        enum: ['Admin', 'Lecturer', 'Student'],
        default: 'Student'
    },
    studentId: {
        type: String,
        sparse: true, // Only for students
        unique: true
    },
    department: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    }
}, { timestamps: true });

// Add password hashing middleware could go here, or in controller.
// For now, keeping it simple in the model.

const User = mongoose.model('User', userSchema);

module.exports = User;

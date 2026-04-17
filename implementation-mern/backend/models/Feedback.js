const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true
    },
    lecturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teachingRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    videoRating: {
        type: Number,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        enum: ['Module', 'Lecturer', 'General'],
        default: 'General'
    }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);

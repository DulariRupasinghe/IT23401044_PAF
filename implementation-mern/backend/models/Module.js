const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    lecturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    department: {
        type: String,
        required: true
    },
    totalLectures: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);

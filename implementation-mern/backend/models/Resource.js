const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a resource name'],
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Lecture Hall', 'Lab', 'Meeting Room', 'Equipment']
    },
    capacity: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['ACTIVE', 'OUT_OF_SERVICE'],
        default: 'ACTIVE'
    },
    availabilityWindows: [{
        day: String,
        startTime: String,
        endTime: String
    }],
    description: String
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);

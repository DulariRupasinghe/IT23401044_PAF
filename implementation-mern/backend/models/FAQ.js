const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Academic', 'Financial', 'Technical', 'General'],
        default: 'General'
    },
    tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('FAQ', faqSchema);

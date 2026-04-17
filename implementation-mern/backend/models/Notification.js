const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['info', 'success', 'warning', 'error'],
        default: 'info'
    },
    status: {
        type: String,
        enum: ['read', 'unread'],
        default: 'unread'
    },
    relatedId: {
        type: String, // Optional ID of the related object (e.g. attendance record ID)
    }
}, { timestamps: true });

// Index for fast retrieval of user notifications
notificationSchema.index({ recipient: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;

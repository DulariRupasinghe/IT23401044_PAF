const Feedback = require('../models/Feedback');
const Module = require('../models/Module');
const { createInternalNotification } = require('./notificationController');

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private (Student)
const submitFeedback = async (req, res) => {
    const { moduleId, teachingRating, videoRating, comment, category } = req.body;

    if (!moduleId || !teachingRating) {
        return res.status(400).json({ message: 'Please provide module and rating' });
    }

    const module = await Module.findById(moduleId);
    if (!module) {
        return res.status(404).json({ message: 'Module not found' });
    }

    const feedback = await Feedback.create({
        student: req.user.id,
        module: moduleId,
        lecturer: module.lecturer,
        teachingRating,
        videoRating,
        comment,
        category: category || 'General'
    });

    // Notify lecturer of new feedback
    if (module.lecturer) {
        await createInternalNotification(
            module.lecturer,
            "New Feedback Received",
            `A student has submitted feedback for your module: ${module.name || "Module"}.`,
            "info",
            feedback._id
        );
    }

    res.status(201).json(feedback);
};

// @desc    Get feedback for a module/lecturer
// @route   GET /api/feedback/module/:moduleId
// @access  Private (Admin/Lecturer)
const getModuleFeedback = async (req, res) => {
    const feedback = await Feedback.find({ module: req.params.moduleId })
        .populate('student', 'name')
        .sort({ createdAt: -1 });

    res.status(200).json(feedback);
};

module.exports = {
    submitFeedback,
    getModuleFeedback
};

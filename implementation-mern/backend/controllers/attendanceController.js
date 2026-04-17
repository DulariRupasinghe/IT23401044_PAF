const AttendanceSession = require('../models/AttendanceSession');
const AttendanceRecord = require('../models/AttendanceRecord');
const Module = require('../models/Module');
const User = require('../models/User');
const { createInternalNotification } = require('./notificationController');
const QRCode = require('qrcode');
const crypto = require('crypto');

// @desc    Create attendance session (Generate QR)
// @route   POST /api/attendance/session
// @access  Private (Lecturer)
const createSession = async (req, res) => {
    const { moduleId, durationMinutes } = req.body;

    if (!moduleId) {
        return res.status(400).json({ message: 'Module ID is required' });
    }

    const module = await Module.findById(moduleId);
    if (!module) {
        return res.status(404).json({ message: 'Module not found' });
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + (durationMinutes || 5) * 60 * 1000);

    const session = await AttendanceSession.create({
        module: moduleId,
        lecturer: req.user.id,
        token,
        expiresAt
    });

    // Increment total lectures for the module
    module.totalLectures += 1;
    await module.save();

    // Generate QR Data URL
    const qrData = JSON.stringify({
        sessionId: session._id,
        token: session.token
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrData);

    res.status(201).json({
        sessionId: session._id,
        qrCode: qrCodeDataUrl,
        expiresAt
    });
};

// @desc    Mark attendance (Student scan)
// @route   POST /api/attendance/mark
// @access  Private (Student)
const markAttendance = async (req, res) => {
    const { sessionId, token } = req.body;

    const session = await AttendanceSession.findById(sessionId);

    if (!session || !session.isActive) {
        return res.status(404).json({ message: 'Session not found or inactive' });
    }

    // Check expiry
    if (new Date() > session.expiresAt) {
        session.isActive = false;
        await session.save();
        return res.status(400).json({ message: 'Session has expired' });
    }

    // Check token
    if (session.token !== token) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    // Check if duplicate
    const existingRecord = await AttendanceRecord.findOne({
        student: req.user.id,
        session: sessionId
    });

    if (existingRecord) {
        return res.status(400).json({ message: 'Attendance already marked' });
    }

    const record = await AttendanceRecord.create({
        student: req.user.id,
        session: sessionId,
        module: session.module,
        status: 'Present'
    });

    // Notify student of success
    await createInternalNotification(
        req.user.id,
        "Attendance Marked",
        `Your attendance for the module ${session.module.name || "Module"} has been successfully recorded.`,
        "success",
        record._id
    );

    res.status(201).json(record);
};

// @desc    Get attendance analytics for a module
// @route   GET /api/attendance/analytics/:moduleId
// @access  Private
const getModuleAnalytics = async (req, res) => {
    const { moduleId } = req.params;

    const module = await Module.findById(moduleId);
    if (!module) {
        return res.status(404).json({ message: 'Module not found' });
    }

    // Get all students in the department of the module
    const students = await User.find({ role: 'Student', department: module.department });

    const report = [];

    for (const student of students) {
        const attendedCount = await AttendanceRecord.countDocuments({
            student: student._id,
            module: moduleId,
            status: 'Present'
        });

        const percentage = module.totalLectures > 0 
            ? (attendedCount / module.totalLectures) * 100 
            : 0;

        report.push({
            studentId: student.studentId,
            name: student.name,
            attendedCount,
            totalLectures: module.totalLectures,
            percentage: percentage.toFixed(2),
            eligible: percentage >= 75
        });
    }

    res.status(200).json(report);
};

module.exports = {
    createSession,
    markAttendance,
    getModuleAnalytics
};

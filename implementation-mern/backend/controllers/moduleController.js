const Module = require('../models/Module');

// @desc    Create a module
// @route   POST /api/modules
// @access  Private (Admin)
const createModule = async (req, res) => {
    const { code, name, lecturerId, department } = req.body;
    
    const module = await Module.create({
        code,
        name,
        lecturer: lecturerId,
        department
    });

    res.status(201).json(module);
};

// @desc    Get all modules
// @route   GET /api/modules
// @access  Private
const getModules = async (req, res) => {
    let query = {};
    
    // If lecturer, only show their modules
    if (req.user.role === 'Lecturer') {
        query.lecturer = req.user.id;
    } else if (req.user.role === 'Student') {
        query.department = req.user.department;
    }

    const modules = await Module.find(query).populate('lecturer', 'name');
    res.status(200).json(modules);
};

module.exports = {
    createModule,
    getModules
};

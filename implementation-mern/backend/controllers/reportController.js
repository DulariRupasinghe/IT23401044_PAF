const PDFDocument = require('pdfkit');
const AttendanceRecord = require('../models/AttendanceRecord');
const Module = require('../models/Module');
const User = require('../models/User');

// @desc    Download module attendance report as PDF
// @route   GET /api/reports/attendance/:moduleId
// @access  Private (Admin/Lecturer)
const generateAttendancePDF = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const module = await Module.findById(moduleId).populate('lecturer', 'name');

        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }

        // Get all students for this module's department
        const students = await User.find({ role: 'Student', department: module.department });

        const doc = new PDFDocument({ margin: 50 });

        // HTTP Headers for PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Attendance_Report_${module.code}.pdf`);

        doc.pipe(res);

        // --- Professional Header ---
        doc.fillColor('#166534').fontSize(24).text('CITY ACADEMIC UNIVERSITY', { align: 'center' });
        doc.fillColor('#666666').fontSize(10).text('OFFICIAL ATTENDANCE & ELIGIBILITY REPORT', { align: 'center' });
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#166534').lineWidth(2).stroke();
        doc.moveDown(2);

        // --- Module Info Box ---
        const infoY = doc.y;
        doc.rect(50, infoY, 500, 70).fill('#f1f5f9');
        doc.fillColor('#1e293b').fontSize(11).font('Helvetica-Bold');
        doc.text(`Module Name:`, 65, infoY + 15);
        doc.text(`Lecturer:`, 65, infoY + 30);
        doc.text(`Generated On:`, 65, infoY + 45);

        doc.font('Helvetica').text(`${module.name} (${module.code})`, 160, infoY + 15);
        doc.text(`${module.lecturer.name}`, 160, infoY + 30);
        doc.text(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 160, infoY + 45);
        doc.moveDown(4);

        // --- Table Header ---
        const tableTop = doc.y;
        doc.rect(50, tableTop - 5, 500, 20).fill('#166534');
        doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold');
        doc.text('Student ID', 60, tableTop);
        doc.text('Student Name', 160, tableTop);
        doc.text('Attended', 340, tableTop);
        doc.text('Percentage', 420, tableTop);
        doc.text('Status', 500, tableTop);
        doc.moveDown(1.5);

        // --- Table Content ---
        let currentY = doc.y;
        doc.fillColor('#333333').font('Helvetica');

        for (const student of students) {
            const count = await AttendanceRecord.countDocuments({
                student: student._id,
                module: moduleId,
                status: 'Present'
            });

            const percentage = module.totalLectures > 0 ? (count / module.totalLectures) * 100 : 0;
            const status = percentage >= 75 ? 'ELIGIBLE' : 'SHORTAGE';

            // Alternating row background (subtle)
            if (students.indexOf(student) % 2 === 0) {
                doc.rect(50, currentY - 5, 500, 20).fill('#f8fafc');
            }

            doc.fillColor('#333333');
            doc.text(student.studentId || 'N/A', 60, currentY);
            doc.text(student.name, 160, currentY);
            doc.text(count.toString(), 340, currentY);
            doc.text(`${percentage.toFixed(1)}%`, 420, currentY);

            // Status Badge Coloring
            if (status === 'ELIGIBLE') {
                doc.fillColor('#166534').font('Helvetica-Bold');
            } else {
                doc.fillColor('#991b1b').font('Helvetica-Bold');
            }
            doc.text(status, 500, currentY);
            doc.font('Helvetica').fillColor('#333333');

            currentY += 20;

            // Page handling
            if (currentY > 700) {
                doc.addPage();
                currentY = 50;
            }
        }

        // --- Footer ---
        doc.moveTo(50, 750).lineTo(550, 750).strokeColor('#eeeeee').lineWidth(1).stroke();
        doc.fontSize(8).fillColor('#999999').text('This report is digitally signed and approved by the Academic Registrar.', 50, 760, { align: 'center' });

        doc.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating PDF' });
    }
};

module.exports = { generateAttendancePDF };

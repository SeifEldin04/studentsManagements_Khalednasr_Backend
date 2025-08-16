const attendanceService = require('../services/attendance.service');
const httpStatusText = require('../utils/httpStatusText');

const addOrUpdateAttendance = async (req, resp) => {
    try {
        const data = {
            ...req.body,
            user_id: req.user.id // Adding user_id from token to the data
        };

        const attendance = await attendanceService.addOrUpdateAttendance(data);
        resp.status(201).json({ status: httpStatusText.SUCCESS, data: { attendance } });
    } catch (error) {
        console.error('Error adding or updating attendance', error);
        resp.status(500).json({ status: httpStatusText.FAIL, message: 'Error adding or updating attendance', error: error.message });
    }
}

const getAllAttendance = async (req, resp) => {
    const { student_id, center_id, grade, month } = req.query;

    if (!center_id || !grade) {
        return resp.status(500).json({ status: httpStatusText.FAIL, message: 'Missing required query parameters' });
    }

    if (student_id && center_id && grade && month) {
        try {
            const attendance = await attendanceService.getAttendanceByStudentAndMonth(student_id, center_id, grade, month, req.user.id);
            resp.status(200).json({ status: httpStatusText.SUCCESS, data: { attendance } });
        } catch (error) {
            console.error('Error getting attendance by student and month', error);
            resp.status(500).json({ status: httpStatusText.FAIL, message: 'Error getting attendance by student and month', error: error.message });
        }
    } else if (center_id && grade && month) {
        try {
            const attendance = await attendanceService.getAttendanceByCenterIdAndGradeAndMonth(center_id, grade, month, req.user.id);
            resp.json({ status: httpStatusText.SUCCESS, data: { attendance } });
        } catch (error) {
            console.error('Error in get All Attendance :', error);
            resp.status(500).json({ status: httpStatusText.FAIL, message: 'Error in get All Attendance :', error: error.message });
        }
    } else if (student_id && center_id && grade) {
        try {
            const attendance = await attendanceService.getAttendanceForAllMonths(student_id, center_id, grade, req.user.id);
            resp.json({ status: httpStatusText.SUCCESS, data: { attendance } });
        } catch (error) {
            console.error('Error in get All Attendance For All months :', error);
            resp.status(500).json({ status: httpStatusText.FAIL, message: 'Error in get All Attendance For All months :', error: error.message });
        }
    }
}

const deleteAttendance = async (req, resp) => {
    const { student_id, center_id, grade, month } = req.query;

    try {
        await attendanceService.deleteAttendance(student_id, center_id, grade, month, req.user.id);
        resp.status(204).json({ status: httpStatusText.SUCCESS, message: 'Attendance deleted successfully' });
    } catch (error) {
        console.error('Error deleting attendance', error);
        resp.status(500).json({ status: httpStatusText.FAIL, message: 'Error deleting attendance', error: error.message });
    }
}

module.exports = {
    addOrUpdateAttendance,
    getAllAttendance,
    deleteAttendance
};
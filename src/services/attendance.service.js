// استدعاء الموديل
const attendanceModel = require('../models/attendance.model');

// إضافة أو تعديل الحضور
const addOrUpdateAttendance = async (data) => {
    try {
        return await attendanceModel.addOrUpdateAttendance(data);
    } catch (error) {
        console.error('خطأ في الخدمة أثناء إضافة/تعديل الحضور:', error);
        throw error;
    }
};

// جلب الحضور لطالب معين في شهر معين
const getAttendanceByStudentAndMonth = async (student_id, center_id, grade, month, user_id) => {
    try {
        return await attendanceModel.getAttendanceByStudentAndMonth(student_id, center_id, grade, month, user_id);
    } catch (error) {
        console.error('خطأ في الخدمة أثناء جلب حضور الطالب:', error);
        throw error;
    }
};

// جلب كل الحضور لمركز ومرحلة محددة في شهر معين
const getAttendanceByCenterIdAndGradeAndMonth = async (center_id, grade, month, user_id) => {
    try {
        return await attendanceModel.getAttendanceByCenterIdAndGradeAndMonth(center_id, grade, month, user_id);
    } catch (error) {
        console.error('خطأ في الخدمة أثناء جلب كل سجلات الحضور:', error);
        throw error;
    }
};

// جلب الحضور لكل الشهور لطالب معين
const getAttendanceForAllMonths = async (student_id, center_id, grade, user_id) => {
    try {
        return await attendanceModel.getAttendanceForAllMonths(student_id, center_id, grade, user_id);
    } catch (error) {
        console.error('خطأ في الخدمة أثناء جلب حضور جميع الشهور:', error);
        throw error;
    }
};

// حذف الحضور
const deleteAttendance = async (student_id, center_id, grade, month, user_id) => {
    try {
        return await attendanceModel.deleteAttendance(student_id, center_id, grade, month, user_id);
    } catch (error) {
        console.error('خطأ في الخدمة أثناء حذف الحضور:', error);
        throw error;
    }
};

// تصدير جميع الدوال
module.exports = {
    addOrUpdateAttendance,
    getAttendanceByStudentAndMonth,
    getAttendanceByCenterIdAndGradeAndMonth,
    getAttendanceForAllMonths,
    deleteAttendance
};

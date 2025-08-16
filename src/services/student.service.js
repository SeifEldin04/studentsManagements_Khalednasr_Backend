const studentsModel = require('../models/student.model');

// إضافة طالب جديد
const addStudent = async (data) => {
    try {
        return await studentsModel.addStudent(data);
    } catch (error) {
        console.error('Error in service - حدث خطأ أثناء إضافة الطالب:', error);
        throw error;
    }
};

// جلب جميع الطلاب للمستخدم
const getAllStudents = async (user_id) => {
    try {
        return await studentsModel.getAllStudents(user_id);
    } catch (error) {
        console.error('Error in service - Get all students:', error);
        throw error;
    }
};

// جلب الطلاب بناءً على السنتر والصف
const getStudentByCenterIdAndGrade = async (center_id, grade, user_id) => {
    try {
        return await studentsModel.getStudentByCenterIdAndGrade(center_id, grade, user_id);
    } catch (error) {
        console.error('Error in service - Get students by center and grade:', error);
        throw error;
    }
};

// جلب طالب معين بالـ ID
const getStudentById = async (id, user_id) => {
    try {
        return await studentsModel.getStudentById(id, user_id);
    } catch (error) {
        console.error('Error in service - Get student by ID:', error);
        throw error;
    }
};

// تحديث بيانات طالب
const updateStudent = async (id, data) => {
    try {
        const currentCenterId = await studentsModel.getStudentCenterId(id);
        const updatedStudent = await studentsModel.updateStudent(id, data);

        // إذا تغير السنتر، يتم نقل الدرجات أيضاً
        if (data.center_id !== currentCenterId) {
            await studentsModel.transferStudentGrades(id, data.center_id);
        }

        return updatedStudent;
    } catch (error) {
        console.error('Error in service - حدث خطأ أثناء تحديث الطالب :', error);
        throw error;
    }
};

// حذف طالب
const deleteStudent = async (id, user_id) => {
    try {
        return await studentsModel.deleteStudent(id, user_id);
    } catch (error) {
        console.error('Error in service - حدث خطأ أثناء حذف الطالب :', error);
        throw error;
    }
};

module.exports = {
    addStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    getStudentByCenterIdAndGrade,
};

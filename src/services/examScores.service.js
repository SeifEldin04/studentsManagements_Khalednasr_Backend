const examScoresModel = require('../models/examScores.model');

// إضافة أو تحديث درجات الامتحان
const addOrUpdateExamScores = async (data) => {
    try {
        return await examScoresModel.addOrUpdateExamScores(data);
    } catch (error) {
        console.error('Error in service - خطا في اضافة درجات الامتحان', error);
        throw error;
    }
};

// جلب الدرجات لطالب معين في شهر معين
const getAllExamScoresByStudentAndMonth = async (student_id, center_id, grade, month, user_id) => {
    try {
        return await examScoresModel.getAllExamScoresByStudentAndMonth(
            student_id, center_id, grade, month, user_id
        );
    } catch (error) {
        console.error('Error in service - خطأ في الحصول على الدرجات لهذا الطالب', error);
        throw error;
    }
};

// جلب جميع الدرجات حسب السنتر والصف والشهر
const getAllExamScoresByCenterIdAndGradeAndMonth = async (center_id, grade, month, user_id) => {
    try {
        return await examScoresModel.getAllExamScoresByCenterIdAndGradeAndMonth(
            center_id, grade, month, user_id
        );
    } catch (error) {
        console.error('Error in service - خطأ في الحصول على جميع درجات الامتحان حسب السنتر', error);
        throw error;
    }
};

// جلب كل الدرجات لطالب في جميع الشهور
const getAllExamScoresForAllMonths = async (student_id, center_id, grade, user_id) => {
    try {
        return await examScoresModel.getAllExamScoresForAllMonths(
            student_id, center_id, grade, user_id
        );
    } catch (error) {
        console.error('Error in service - خطأ في الحصول على درجات الامتحان لجميع الأشهر', error);
        throw error;
    }
};

// حذف درجات الطالب لشهر معين
const deleteExamScores = async (student_id, center_id, grade, month, user_id) => {
    try {
        return await examScoresModel.deleteExamScores(
            student_id, center_id, grade, month, user_id
        );
    } catch (error) {
        console.error('Error in service - خطأ في حذف درجات الامتحان', error);
        throw error;
    }
};

module.exports = {
    addOrUpdateExamScores,
    getAllExamScoresByStudentAndMonth,
    getAllExamScoresByCenterIdAndGradeAndMonth,
    getAllExamScoresForAllMonths,
    deleteExamScores
};

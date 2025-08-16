const studentService = require('../services/student.service');
const httpStatusText = require('../utils/httpStatusText');

// إنشاء طالب جديد
const createStudent = async (req, res) => {
    try {
        const data = {
            ...req.body,
            user_id: req.user.id // إضافة user_id من التوكن
        };

        const student = await studentService.addStudent(data);
        res.status(201).json({ status: httpStatusText.SUCCESS, data: { student } });
    } catch (error) {
        console.error('حدث خطأ اثناء اضافة الطالب', error);
        res.status(500).json({ status: httpStatusText.FAIL, message: 'حدث خطأ اثناء اضافة الطالب', error: error.message });
    }
};

// جلب طالب معين
const getStudentById = async (req, res) => {
    try {
        const student = await studentService.getStudentById(req.params.id, req.user.id);
        if (!student) {
            return res.status(404).json({ status: httpStatusText.FAIL, message: 'الطالب غير موجود' });
        }
        res.status(200).json({ status: httpStatusText.SUCCESS, data: { student } });
    } catch (error) {
        console.error('Error Getting student:', error);
        res.status(500).json({ status: httpStatusText.FAIL, message: 'Error Getting student', error: error.message });
    }
};

// جلب جميع الطلاب أو حسب center_id والgrade
const getStudents = async (req, res) => {
    const { center_id, grade } = req.query;

    try {
        if (center_id && grade) {
            const students = await studentService.getStudentByCenterIdAndGrade(center_id, grade, req.user.id);
            return res.status(200).json({ status: httpStatusText.SUCCESS, data: { students } });
        }

        const students = await studentService.getAllStudents(req.user.id);
        res.status(200).json({ status: httpStatusText.SUCCESS, data: { students } });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ status: httpStatusText.FAIL, message: 'Error fetching students', error: error.message });
    }
};

// تعديل بيانات طالب
const updateStudent = async (req, res) => {
    const { id } = req.params;
    const data = {
        ...req.body,
        user_id: req.user.id
    };

    try {
        const updatedStudent = await studentService.updateStudent(id, data);
        res.status(200).json({
            status: httpStatusText.SUCCESS,
            message: 'Student updated and grades transferred successfully',
            data: { student: updatedStudent }
        });
    } catch (error) {
        console.error('حدث خطأ اثناء تحديث الطالب', error);
        res.status(500).json({ status: httpStatusText.FAIL, message: 'حدث خطأ اثناء تحديث الطالب', error: error.message });
    }
};

// حذف طالب
const deleteStudent = async (req, res) => {
    try {
        await studentService.deleteStudent(req.params.id, req.user.id);
        res.status(200).json({ status: httpStatusText.SUCCESS, message: 'تم حذف الطالب بنجاح' });
    } catch (error) {
        console.error('حدث خطأ اثناء حذف الطالب', error);
        res.status(500).json({ status: httpStatusText.FAIL, message: 'حدث خطأ اثناء حذف الطالب', error: error.message });
    }
};

module.exports = {
    createStudent,
    getStudentById,
    getStudents,
    updateStudent,
    deleteStudent
};

const examScoresService = require('../services/examScores.service');
const httpStatusText = require('../utils/httpStatusText');

// إضافة أو تعديل درجات الامتحان
const addOrUpdateExamScores = async (req, res) => {
    try {
        const data = {
            ...req.body,
            user_id: req.user.id,
        };

        const examScores = await examScoresService.addOrUpdateExamScores(data);

        res.status(201).json({
            status: httpStatusText.SUCCESS,
            data: { examScores }
        });
    } catch (error) {
        console.error('خطأ أثناء إضافة/تعديل درجات الامتحان:', error);
        res.status(500).json({
            status: httpStatusText.FAIL,
            message: 'حدث خطأ أثناء إضافة أو تعديل درجات الامتحان',
            error: error.message
        });
    }
};

// جلب الدرجات حسب نوع الطلب
const getAllExamScores = async (req, res) => {
    const { student_id, center_id, grade, month } = req.query;

    if (!center_id || !grade) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: 'يجب إدخال center_id و grade كوسائط استعلام'
        });
    }

    try {
        let examScores;

        if (student_id && month) {
            // طالب معيّن في شهر معيّن
            examScores = await examScoresService.getAllExamScoresByStudentAndMonth(
                student_id, center_id, grade, month, req.user.id
            );
        } else if (!student_id && month) {
            // كل الطلبة في شهر معيّن
            examScores = await examScoresService.getAllExamScoresByCenterIdAndGradeAndMonth(
                center_id, grade, month, req.user.id
            );
        } else if (student_id && !month) {
            // درجات طالب في كل الشهور
            examScores = await examScoresService.getAllExamScoresForAllMonths(
                student_id, center_id, grade, req.user.id
            );
        } else {
            return res.status(400).json({
                status: httpStatusText.FAIL,
                message: 'يجب إدخال الشهر أو رقم الطالب كحد أدنى من البيانات'
            });
        }

        res.status(200).json({
            status: httpStatusText.SUCCESS,
            data: { examScores }
        });
    } catch (error) {
        console.error('خطأ أثناء جلب درجات الامتحان:', error);
        res.status(500).json({
            status: httpStatusText.FAIL,
            message: 'حدث خطأ أثناء جلب درجات الامتحان',
            error: error.message
        });
    }
};

// حذف درجات طالب معين في شهر معيّن
const deleteExamScores = async (req, res) => {
    const { student_id, center_id, grade, month } = req.query;

    if (!student_id || !center_id || !grade || !month) {
        return res.status(400).json({
            status: httpStatusText.FAIL,
            message: 'يجب إدخال جميع البيانات المطلوبة: student_id, center_id, grade, month'
        });
    }

    try {
        await examScoresService.deleteExamScores(
            student_id, center_id, grade, month, req.user.id
        );

        res.status(204).json({
            status: httpStatusText.SUCCESS,
            message: 'تم حذف درجات الامتحان بنجاح'
        });
    } catch (error) {
        console.error('خطأ أثناء حذف درجات الامتحان:', error);
        res.status(500).json({
            status: httpStatusText.FAIL,
            message: 'حدث خطأ أثناء حذف درجات الامتحان',
            error: error.message
        });
    }
};

module.exports = {
    addOrUpdateExamScores,
    getAllExamScores,
    deleteExamScores
};

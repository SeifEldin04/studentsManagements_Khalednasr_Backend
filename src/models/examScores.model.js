const pool = require('../../db');

// التحقق من البيانات المطلوبة
const validateExamScoresData = async (data) => {
    const { center_id, grade, month } = data;
    if (!center_id || !grade || !month) {
        throw new Error('المدخلات المطلوبة مفقودة');
    }
};

// التحقق من وجود السنتر
const checkCenterIdExists = async (center_id) => {
    const { rows } = await pool.query('SELECT id FROM centers WHERE id = $1', [center_id]);
    if (rows.length === 0) {
        throw new Error(`السنتر ذو الرقم ${center_id} غير موجود`);
    }
};

// التحقق من وجود الطالب
const checkStudentIdExists = async (student_id) => {
    const { rows } = await pool.query('SELECT id FROM students WHERE id = $1', [student_id]);
    if (rows.length === 0) {
        throw new Error(`الطالب ذو الرقم ${center_id} غير موجود`);
    }
};

// إضافة أو تعديل درجات الامتحانات
const addOrUpdateExamScores = async (data) => {
    const {
        student_id, center_id, grade, month,
        exam1, exam1_max, exam2, exam2_max,
        exam3, exam3_max, exam4, exam4_max,
        exam5, exam5_max, exam6, exam6_max,
        exam7, exam7_max, exam8, exam8_max,
        user_id
    } = data;

    await validateExamScoresData({ student_id, center_id, grade, month });

    try {
        await pool.query('BEGIN');

        await checkCenterIdExists(center_id);
        await checkStudentIdExists(student_id);

        const { rows } = await pool.query(
            `INSERT INTO exam_scores (
                student_id, center_id, grade, month,
                exam1, exam1_max, exam2, exam2_max,
                exam3, exam3_max, exam4, exam4_max,
                exam5, exam5_max, exam6, exam6_max,
                exam7, exam7_max, exam8, exam8_max,
                user_id
            ) VALUES (
                $1,$2,$3,$4,
                $5,$6,$7,$8,
                $9,$10,$11,$12,
                $13,$14,$15,$16,
                $17,$18,$19,$20,$21
            )
            ON CONFLICT (student_id, center_id, grade, month)
            DO UPDATE SET
                exam1 = EXCLUDED.exam1,
                exam1_max = EXCLUDED.exam1_max,
                exam2 = EXCLUDED.exam2,
                exam2_max = EXCLUDED.exam2_max,
                exam3 = EXCLUDED.exam3,
                exam3_max = EXCLUDED.exam3_max,
                exam4 = EXCLUDED.exam4,
                exam4_max = EXCLUDED.exam4_max,
                exam5 = EXCLUDED.exam5,
                exam5_max = EXCLUDED.exam5_max,
                exam6 = EXCLUDED.exam6,
                exam6_max = EXCLUDED.exam6_max,
                exam7 = EXCLUDED.exam7,
                exam7_max = EXCLUDED.exam7_max,
                exam8 = EXCLUDED.exam8,
                exam8_max = EXCLUDED.exam8_max
            RETURNING *`,
            [
                student_id, center_id, grade, month,
                exam1, exam1_max, exam2, exam2_max,
                exam3, exam3_max, exam4, exam4_max,
                exam5, exam5_max, exam6, exam6_max,
                exam7, exam7_max, exam8, exam8_max,
                user_id
            ]
        );

        await pool.query('COMMIT');
        return rows[0];
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('حدث خطأ أثناء تعديل درجات الطالب', error);
        throw error;
    }
};

// استرجاع درجات طالب معين في شهر معين
const getAllExamScoresByStudentAndMonth = async (student_id, center_id, grade, month, user_id) => {
    await validateExamScoresData({ student_id, center_id, grade, month });

    try {
        await pool.query('BEGIN');
        await checkCenterIdExists(center_id);
        await checkStudentIdExists(student_id);

        const { rows } = await pool.query(
            `SELECT * FROM exam_scores
             WHERE student_id = $1 AND center_id = $2 AND grade = $3 AND month = $4 AND user_id = $5`,
            [student_id, center_id, grade, month, user_id]
        );

        await pool.query('COMMIT');
        return rows;
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('حدث خطأ أثناء جلب درجات الامتحان للطالب', error);
        throw error;
    }
};

// استرجاع درجات جميع الطلبة في سنتر ودرجة وشهر معين
const getAllExamScoresByCenterIdAndGradeAndMonth = async (center_id, grade, month, user_id) => {
    await validateExamScoresData({ center_id, grade, month });

    try {
        await pool.query('BEGIN');
        await checkCenterIdExists(center_id);

        const { rows } = await pool.query(
            `SELECT * FROM exam_scores
             WHERE center_id = $1 AND grade = $2 AND month = $3 AND user_id = $4
             ORDER BY student_id`,
            [center_id, grade, month, user_id]
        );

        await pool.query('COMMIT');
        return rows;
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('حدث خطأ أثناء جلب درجات الاختبار للسنتر والصف', error);
        throw error;
    }
};

// حساب مجموع الدرجات عبر كل الشهور لطالب معين
const getAllExamScoresForAllMonths = async (student_id, center_id, grade, user_id) => {
    try {
        await pool.query('BEGIN');
        await checkCenterIdExists(center_id);
        await checkStudentIdExists(student_id);

        const { rows } = await pool.query(
            `SELECT 
                SUM(
                    COALESCE(exam1::int, 0) + COALESCE(exam2::int, 0) +
                    COALESCE(exam3::int, 0) + COALESCE(exam4::int, 0) +
                    COALESCE(exam5::int, 0) + COALESCE(exam6::int, 0) +
                    COALESCE(exam7::int, 0) + COALESCE(exam8::int, 0)
                ) as total_score,
                SUM(
                    COALESCE(exam1_max::int, 0) + COALESCE(exam2_max::int, 0) +
                    COALESCE(exam3_max::int, 0) + COALESCE(exam4_max::int, 0) +
                    COALESCE(exam5_max::int, 0) + COALESCE(exam6_max::int, 0) +
                    COALESCE(exam7_max::int, 0) + COALESCE(exam8_max::int, 0)
                ) as total_max_score
             FROM exam_scores
             WHERE student_id = $1 AND center_id = $2 AND grade = $3 AND user_id = $4`,
            [student_id, center_id, grade, user_id]
        );

        await pool.query('COMMIT');

        if (rows.length > 0) {
            const { total_score, total_max_score } = rows[0];
            const percentage = total_max_score > 0 ? ((total_score / total_max_score) * 100).toFixed(2) : 0;
            return {
                total_score: parseInt(total_score) || 0,
                total_max_score: parseInt(total_max_score) || 0,
                percentage: parseFloat(percentage)
            };
        } else {
            return { total_score: 0, total_max_score: 0, percentage: 0 };
        }
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('خطأ في حساب مجموع الدرجات', error);
        throw error;
    }
};

// حذف درجات الطالب لشهر معين
const deleteExamScores = async (student_id, center_id, grade, month, user_id) => {
    await validateExamScoresData({ student_id, center_id, grade, month });

    try {
        await pool.query('BEGIN');
        await checkCenterIdExists(center_id);
        await checkStudentIdExists(student_id);

        await pool.query(
            `DELETE FROM exam_scores
             WHERE student_id = $1 AND center_id = $2 AND grade = $3 AND month = $4 AND user_id = $5`,
            [student_id, center_id, grade, month, user_id]
        );

        await pool.query('COMMIT');
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('خطأ في حذف درجات الامتحان', error);
        throw error;
    }
};

module.exports = {
    addOrUpdateExamScores,
    getAllExamScoresByCenterIdAndGradeAndMonth,
    getAllExamScoresByStudentAndMonth,
    getAllExamScoresForAllMonths,
    deleteExamScores
};

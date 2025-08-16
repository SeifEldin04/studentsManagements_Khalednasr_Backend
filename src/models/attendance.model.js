const pool = require('../../db');

// التحقق من البيانات المطلوبة
const validateAttendanceData = async (data) => {
    const { student_id, center_id, grade, month } = data;

    if (!center_id || !grade || !month) {
        throw new Error('هناك بيانات أساسية ناقصة: تأكد من إدخال رقم السنتر، الصف، والشهر');
    }
}

// التحقق من وجود السنتر
const checkCenterIdExists = async (center_id) => {
    const { rows } = await pool.query('SELECT id FROM centers WHERE id = $1', [center_id]);

    if (rows.length === 0) {
        throw new Error(`السنتر برقم (${center_id}) غير موجود في النظام`);
    }
}

// التحقق من وجود الطالب
const checkStudentIdExists = async (student_id) => {
    const { rows } = await pool.query('SELECT id FROM students WHERE id = $1', [student_id]);

    if (rows.length === 0) {
        throw new Error(`الطالب برقم (${student_id}) غير موجود في النظام`);
    }
}

// إضافة أو تعديل الحضور
const addOrUpdateAttendance = async (data) => {
    const { student_id, center_id, grade, month, class1, class2, class3, class4, class5, class6, class7, class8, user_id } = data;

    await validateAttendanceData({ student_id, center_id, grade, month });

    try {
        await pool.query('BEGIN');

        await checkCenterIdExists(center_id);
        await checkStudentIdExists(student_id);

        const { rows } = await pool.query(
            `INSERT INTO attendance (student_id, center_id, grade, month, class1, class2, class3, class4, class5, class6, class7, class8, user_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
            ON CONFLICT (student_id, center_id, grade, month) 
            DO UPDATE SET
                class1 = EXCLUDED.class1,
                class2 = EXCLUDED.class2,
                class3 = EXCLUDED.class3,
                class4 = EXCLUDED.class4,
                class5 = EXCLUDED.class5,
                class6 = EXCLUDED.class6,
                class7 = EXCLUDED.class7,
                class8 = EXCLUDED.class8
            RETURNING *;`,
            [student_id, center_id, grade, month, class1, class2, class3, class4, class5, class6, class7, class8, user_id]
        );

        await pool.query('COMMIT');
        return rows[0];

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('خطأ أثناء إضافة/تعديل الحضور:', error);
        throw new Error('حدث خطأ أثناء حفظ بيانات الحضور، حاول مرة أخرى');
    }
}

// الحصول على حضور طالب لشهر معين
const getAttendanceByStudentAndMonth = async (student_id, center_id, grade, month, user_id) => {
    await validateAttendanceData({ student_id, center_id, grade, month });

    try {
        await pool.query('BEGIN');

        await checkCenterIdExists(center_id);
        await checkStudentIdExists(student_id);

        const { rows } = await pool.query(
            'SELECT * FROM attendance WHERE student_id = $1 AND center_id = $2 AND grade = $3 AND month = $4 AND user_id = $5',
            [student_id, center_id, grade, month, user_id]
        );

        await pool.query('COMMIT');
        return rows;

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('خطأ أثناء جلب بيانات الحضور لهذا الطالب:', error);
        throw new Error('حدث خطأ أثناء تحميل بيانات الحضور، حاول مرة أخرى');
    }
}

// الحصول على حضور كل الطلاب لشهر معين
const getAttendanceByCenterIdAndGradeAndMonth = async (center_id, grade, month, user_id) => {
    await validateAttendanceData({ center_id, grade, month });

    try {
        await pool.query('BEGIN');

        await checkCenterIdExists(center_id);

        const { rows } = await pool.query(
            'SELECT * FROM attendance WHERE center_id = $1 AND grade = $2 AND month = $3 AND user_id = $4 ORDER BY student_id',
            [center_id, grade, month, user_id]
        );

        await pool.query('COMMIT');
        return rows;

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('خطأ أثناء جلب كل سجلات الحضور:', error);
        throw new Error('حدث خطأ أثناء تحميل بيانات الحضور، حاول مرة أخرى');
    }
}

// الحصول على إجمالي الحضور لكل الشهور
const getAttendanceForAllMonths = async (student_id, center_id, grade, user_id) => {
    try {
        await pool.query('BEGIN');

        await checkCenterIdExists(center_id);
        await checkStudentIdExists(student_id);

        const { rows } = await pool.query(
            `SELECT 
                SUM(CASE WHEN class1 THEN 1 ELSE 0 END +
                    CASE WHEN class2 THEN 1 ELSE 0 END +
                    CASE WHEN class3 THEN 1 ELSE 0 END +
                    CASE WHEN class4 THEN 1 ELSE 0 END +
                    CASE WHEN class5 THEN 1 ELSE 0 END +
                    CASE WHEN class6 THEN 1 ELSE 0 END +
                    CASE WHEN class7 THEN 1 ELSE 0 END +
                    CASE WHEN class8 THEN 1 ELSE 0 END) as total_attended,
                COUNT(*) * 8 as total_classes
            FROM attendance 
            WHERE student_id = $1 AND center_id = $2 AND grade = $3 AND user_id = $4`,
            [student_id, center_id, grade, user_id]
        );

        await pool.query('COMMIT');

        if (rows.length > 0) {
            const { total_attended, total_classes } = rows[0];
            const percentage = total_classes > 0 ? (total_attended / total_classes * 100).toFixed(2) : 0;
            return {
                total_attended: parseInt(total_attended) || 0,
                total_classes: parseInt(total_classes) || 0,
                percentage: parseFloat(percentage)
            };
        } else {
            return { total_attended: 0, total_classes: 0, percentage: 0 };
        }

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('خطأ أثناء حساب إجمالي الحضور:', error);
        throw new Error('حدث خطأ أثناء حساب إجمالي الحضور، حاول مرة أخرى');
    }
}

// حذف حضور طالب لشهر معين
const deleteAttendance = async (student_id, center_id, grade, month, user_id) => {
    await validateAttendanceData({ student_id, center_id, grade, month });

    try {
        await pool.query('BEGIN');

        await checkCenterIdExists(center_id);
        await checkStudentIdExists(student_id);

        await pool.query('DELETE FROM attendance WHERE student_id = $1 AND center_id = $2 AND grade = $3 AND month = $4 AND user_id = $5',
            [student_id, center_id, grade, month, user_id]
        );

        await pool.query('COMMIT');

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('خطأ أثناء حذف بيانات الحضور:', error);
        throw new Error('حدث خطأ أثناء حذف بيانات الحضور، حاول مرة أخرى');
    }
}

module.exports = {
    addOrUpdateAttendance,
    getAttendanceByCenterIdAndGradeAndMonth,
    getAttendanceByStudentAndMonth,
    getAttendanceForAllMonths,
    deleteAttendance
};

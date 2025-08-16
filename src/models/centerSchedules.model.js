const pool = require('../../db');

// ✅ التحقق من البيانات المطلوبة
const validateCenterScheduleData = async (data) => {
    const { center_id, grade, day_of_week, time, subject } = data;

    if (!center_id || !grade || !day_of_week || !time || !subject) {
        throw new Error('المدخلات المطلوبة مفقودة');
    }

    // ✅ (Optional) تحقق من القيم الصحيحة
    // const validGrades = ['الصف الاول الثانوي', 'الصف الثاني الثانوي علمي', 'الصف الثاني الثانوي ادبي', 'الصف الثالث الثانوي'];
    // if (!validGrades.includes(grade)) throw new Error('Invalid grade value');

    // const validDays = ['السبت', 'الاحد', 'الاثنين', 'الثلاثاء', 'الاربعاء', 'الخميس'];
    // if (!validDays.includes(day_of_week)) throw new Error('Invalid day_of_week value');
};

// ✅ التحقق من وجود center
const checkCenterIdExists = async (center_id) => {
    const { rows } = await pool.query('SELECT id FROM centers WHERE id = $1', [center_id]);
    if (rows.length === 0) {
        throw new Error(`السنتر ذو الرقم ${center_id} غير موجود`);
    }
};

// ✅ إنشاء جدول مواعيد جديد
const createCenterSchedule = async (data) => {
    await validateCenterScheduleData(data);
    const { center_id, grade, day_of_week, time, subject, user_id } = data;

    try {
        await pool.query('BEGIN');
        await checkCenterIdExists(center_id);

        const { rows } = await pool.query(
            `INSERT INTO center_schedules 
             (center_id, grade, day_of_week, time, subject, user_id) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [center_id, grade, day_of_week, time, subject, user_id]
        );

        await pool.query('COMMIT');
        return rows[0];

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('حدث خطأ أثناء إضافة ميعاد الحصة :', error.message);
        throw error;
    }
};

// ✅ جلب جدول مواعيد بمركز معين
const getCenterScheduleByCenterId = async (center_id, user_id) => {
    const { rows } = await pool.query(
        `SELECT * FROM center_schedules 
         WHERE center_id = $1 AND user_id = $2`,
        [center_id, user_id]
    );
    return rows;
};

// ✅ جلب كل الجداول للمستخدم
const getAllCenterSchedules = async (user_id) => {
    const { rows } = await pool.query(
        `SELECT * FROM center_schedules 
         WHERE user_id = $1 
         ORDER BY id`,
        [user_id]
    );
    return rows;
};

// ✅ تحديث جدول مواعيد
const updateCenterSchedule = async (id, data) => {
    await validateCenterScheduleData(data);
    const { center_id, grade, day_of_week, time, subject, user_id } = data;

    try {
        await pool.query('BEGIN');
        await checkCenterIdExists(center_id);

        const { rows } = await pool.query(
            `UPDATE center_schedules 
             SET center_id = $1, grade = $2, day_of_week = $3, time = $4, subject = $5, user_id = $6 
             WHERE id = $7 
             RETURNING *`,
            [center_id, grade, day_of_week, time, subject, user_id, id]
        );

        await pool.query('COMMIT');
        return rows[0];

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('حدث خطأ أثناء تحديث ميعاد االحصة :', error.message);
        throw error;
    }
};

// ✅ حذف جدول مواعيد
const deleteCenterSchedule = async (id, user_id) => {
    try {
        await pool.query('BEGIN');
        const { rows } = await pool.query(
            `DELETE FROM center_schedules 
             WHERE id = $1 AND user_id = $2 
             RETURNING *`,
            [id, user_id]
        );
        await pool.query('COMMIT');
        return rows[0];
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('حدث خطأ أثناء حذف ميعاد الحصة :', error.message);
        throw error;
    }
};

module.exports = {
    createCenterSchedule,
    getCenterScheduleByCenterId,
    updateCenterSchedule,
    deleteCenterSchedule,
    getAllCenterSchedules
};

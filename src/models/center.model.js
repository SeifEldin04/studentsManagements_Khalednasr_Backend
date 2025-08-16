const pool = require('../../db');

// التحقق من صحة البيانات
const validateCenterData = async (data) => {
    const { name } = data;
    if (!name || typeof name !== 'string' || name.trim() === '') {
        throw new Error('مدحل مطلوب و مفقود أو غير صالح: اسم السنتر');
    }
};

const addCenter = async (data) => {
    await validateCenterData(data);
    const {
        name,
        grade1,
        grade2,
        grade2_specialization_science,
        grade2_specialization_arts,
        grade3,
        statistics,
        user_id
    } = data;

    const db = await pool.connect();
    try {
        await db.query('BEGIN');

        const { rows } = await db.query(
            `INSERT INTO centers 
             (name, grade1, grade2, grade2_specialization_science, grade2_specialization_arts, grade3, statistics, user_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [name, grade1, grade2, grade2_specialization_science, grade2_specialization_arts, grade3, statistics, user_id]
        );

        await db.query('COMMIT');
        return rows[0];
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('حدث خطأ أثناء إضافة السنتر:', error.message);
        throw error;
    } finally {
        db.release();
    }
};

const getAllcenters = async (user_id) => {
    const { rows } = await pool.query(
        'SELECT * FROM centers WHERE user_id = $1 ORDER BY id',
        [user_id]
    );
    return rows;
};

const getCenterById = async (id, user_id) => {
    const { rows } = await pool.query(
        'SELECT * FROM centers WHERE id = $1 AND user_id = $2',
        [id, user_id]
    );
    return rows[0];
};

const updateCenter = async (id, data) => {
    await validateCenterData(data);
    const {
        name,
        grade1,
        grade2,
        grade2_specialization_science,
        grade2_specialization_arts,
        grade3,
        statistics,
        user_id
    } = data;

    const db = await pool.connect();
    try {
        await db.query('BEGIN');

        const { rows } = await db.query(
            `UPDATE centers 
             SET name = $1, grade1 = $2, grade2 = $3, grade2_specialization_science = $4, 
                 grade2_specialization_arts = $5, grade3 = $6, statistics = $7, user_id = $8 
             WHERE id = $9 RETURNING *`,
            [name, grade1, grade2, grade2_specialization_science, grade2_specialization_arts, grade3, statistics, user_id, id]
        );

        await db.query('COMMIT');
        return rows[0];
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('حدث خطأ أثناء تحديث السنتر:', error.message);
        throw error;
    } finally {
        db.release();
    }
};

const deleteCenter = async (id, user_id) => {
    const db = await pool.connect();
    try {
        await db.query('BEGIN');
        await db.query(
            'DELETE FROM centers WHERE id = $1 AND user_id = $2',
            [id, user_id]
        );
        await db.query('COMMIT');
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('حدث خطأ أثناء إضافة السنتر:', error.message);
        throw error;
    } finally {
        db.release();
    }
};

module.exports = {
    addCenter,
    getAllcenters,
    getCenterById,
    updateCenter,
    deleteCenter
};

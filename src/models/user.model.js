const pool = require('../../db');
const bcrypt = require('bcrypt');

const addUser = async (data) => {
    const { userName, password, email } = data;

    const db = await pool.connect(); // نحجز اتصال مستقل عشان نقدر نتحكم في الـ transaction

    try {
        await db.query('BEGIN'); // نبدأ المعاملة

        // تحقق من البيانات
        if (!userName || !password || !email) {
            throw new Error('اسم المستخدم والبريد الإلكتروني وكلمة المرور مطلوب');
        }

        // تأكد من أن اليوزر مش موجود مسبقًا
        const existing = await db.query('SELECT 1 FROM users WHERE email = $1', [email]);
        if (existing.rowCount > 0) {
            throw new Error('البريد الإلكتروني موجود بالفعل');
        }

        // تشفير الباسورد
        const hashedPassword = await bcrypt.hash(password, 10);

        // الإدخال في قاعدة البيانات
        const { rows } = await db.query(
            'INSERT INTO users (userName, password, email) VALUES ($1, $2, $3) RETURNING *',
            [userName, hashedPassword, email]
        );

        await db.query('COMMIT'); // تم كل شيء بنجاح، نثبّت البيانات

        return rows[0];
    } catch (error) {
        await db.query('ROLLBACK'); // حصل خطأ، نرجع كل حاجة
        console.error('Error in addUser with rollback:', error.message);
        throw new Error(error.message || 'فشل في إنشاء المستخدم');
    } finally {
        db.release(); // مهم جدًا: نرجّع الاتصال لـ pool
    }
};

const getUserByEmail = async (email) => {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return rows[0];
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw new Error('Failed to fetch user from DB');
    }
};

const getAllUsers = async () => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        return rows;
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw new Error('Failed to fetch users from DB');
    }
};

module.exports = {
    addUser,
    getUserByEmail,
    getAllUsers
};

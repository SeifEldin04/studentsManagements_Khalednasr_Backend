const pool = require('../../db');

// Validation Function
const validateStudentData = async (data) => {
    const { name, grade, center_id } = data;

    if (!name) {
        throw new Error('مدخل اسم الطالب مطلوب');
    }

    const allowedGrades = [
        'grade1',
        'grade2',
        'grade2_specialization_science',
        'grade2_specialization_arts',
        'grade3',
        'statistics'
    ];

    if (!allowedGrades.includes(grade)) {
        throw new Error('قيمة الصف غير صالحة');
    }

    await checkCenterIdExists(center_id);
};

// Center Existence Check
const checkCenterIdExists = async (center_id) => {
    const { rows } = await pool.query('SELECT id FROM centers WHERE id = $1', [center_id]);
    if (rows.length === 0) {
        throw new Error(`السنتر ذو الرقم ${center_id} غير موجود`);
    }
};

// Create Student
const addStudent = async (data) => {
    await validateStudentData(data);
    const {
        name,
        grade,
        school,
        center_id,
        center_name,
        address,
        phone_number,
        guardian_phone_number,
        user_id
    } = data;

    try {
        await pool.query('BEGIN');
        const { rows } = await pool.query(
            `INSERT INTO students 
             (name, grade, school, center_id, center_name, address, phone_number, guardian_phone_number, user_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [name, grade, school, center_id, center_name, address, phone_number, guardian_phone_number, user_id]
        );
        await pool.query('COMMIT');
        return rows[0];
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('حدث خطأ أثناء إضافة الطالب', error);
        throw error;
    }
};

// Get All Students by User
const getAllStudents = async (user_id) => {
    const { rows } = await pool.query(
        'SELECT * FROM students WHERE user_id = $1 ORDER BY id',
        [user_id]
    );
    return rows;
};

// Get Students by Center & Grade
const getStudentByCenterIdAndGrade = async (center_id, grade, user_id) => {
    try {
        const { rows } = await pool.query(
            `SELECT * FROM students 
             WHERE center_id = $1 AND grade = $2 AND user_id = $3`,
            [center_id, grade, user_id]
        );
        return rows;
    } catch (error) {
        console.error('Error fetching students by center and grade', error);
        throw error;
    }
};

// Get Student by ID
const getStudentById = async (id, user_id) => {
    const { rows } = await pool.query(
        'SELECT * FROM students WHERE id = $1 AND user_id = $2',
        [id, user_id]
    );
    return rows[0];
};

// Update Student
const updateStudent = async (id, data) => {
    await validateStudentData(data);
    const {
        name,
        grade,
        school,
        center_id,
        center_name,
        address,
        phone_number,
        guardian_phone_number,
        user_id
    } = data;

    try {
        await pool.query('BEGIN');
        const { rows } = await pool.query(
            `UPDATE students 
             SET name = $1, grade = $2, school = $3, center_id = $4, center_name = $5,
                 address = $6, phone_number = $7, guardian_phone_number = $8, user_id = $9 
             WHERE id = $10 RETURNING *`,
            [name, grade, school, center_id, center_name, address, phone_number, guardian_phone_number, user_id, id]
        );
        await pool.query('COMMIT');
        return rows[0];
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('حدث خطأ أثناء تحديث الطالب', error);
        throw error;
    }
};

// Transfer Student Grades (update center_id in exam_scores)
const transferStudentGrades = async (studentId, newCenterId) => {
    const { rows } = await pool.query(
        `UPDATE exam_scores 
         SET center_id = $1 
         WHERE student_id = $2 
         RETURNING *`,
        [newCenterId, studentId]
    );
    return rows;
};

// Get Center ID for a Student
const getStudentCenterId = async (id, user_id) => {
    const { rows } = await pool.query(
        `SELECT center_id 
         FROM students 
         WHERE id = $1 AND user_id = $2`,
        [id, user_id]
    );
    return rows[0]?.center_id;
};

// Delete Student
const deleteStudent = async (id, user_id) => {
    try {
        await pool.query('BEGIN');
        await pool.query('DELETE FROM students WHERE id = $1 AND user_id = $2', [id, user_id]);
        await pool.query('COMMIT');
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('خطأ في حذف الطالب', error);
        throw error;
    }
};

// Export
module.exports = {
    addStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    transferStudentGrades,
    getStudentCenterId,
    deleteStudent,
    getStudentByCenterIdAndGrade
};

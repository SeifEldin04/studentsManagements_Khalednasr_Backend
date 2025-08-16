const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!SECRET_KEY) {
    console.error('JWT_SECRET_KEY is not defined in .env file');
    process.exit(1); // Exit app if missing secret key
}

const createUser = async (data) => {
    try {
        // Check if email already exists
        const existingUser = await userModel.getUserByEmail(data.email);
        if (existingUser) {
            throw new Error('البريد الإلكتروني موجود بالفعل');
        }

        const result = await userModel.addUser(data);
        return result;
    } catch (error) {
        console.error('Error in service createUser:', error.message);
        throw new Error(error.message || 'فشل في إنشاء المستخدم');
    }
};

const loginUser = async (email, password) => {
    try {
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            throw new Error('لم يتم العثور على المستخدم');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('كلمة المرور غير صحيحة');
        }

        const token = jwt.sign(
            { id: user.id, userName: user.userName },
            SECRET_KEY,
            { expiresIn: '7d' }
        );

        return { token, user };
    } catch (error) {
        console.error('Error in service loginUser:', error.message);
        throw new Error('Login failed: ' + error.message);
    }
};

const fetchAllUsers = async () => {
    try {
        const result = await userModel.getAllUsers();
        return result;
    } catch (error) {
        console.error('Error in service fetchAllUsers:', error.message);
        throw new Error('Failed to fetch users');
    }
};

module.exports = {
    createUser,
    loginUser,
    fetchAllUsers
};

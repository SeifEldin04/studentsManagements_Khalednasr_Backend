const userService = require('../services/user.service');
const httpStatusText = require('../utils/httpStatusText');

const createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);

        if (user && user.password) {
            delete user.password;
        }

        res.status(201).json({
            status: httpStatusText.SUCCESS,
            data: { user }
        });
    } catch (error) {
        res.status(400).json({
            status: httpStatusText.FAIL,
            message: error.message || 'حدث خطأ أثناء إنشاء المستخدم'
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { token, user } = await userService.loginUser(email, password);

        if (user && user.password) {
            delete user.password;
        }

        res.status(200).json({
            status: httpStatusText.SUCCESS,
            data: { token, user }
        });
    } catch (error) {
        res.status(401).json({
            status: httpStatusText.FAIL,
            message: error.message || 'Login failed'
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.fetchAllUsers();

        const safeUsers = users.map(u => {
            const { password, ...rest } = u;
            return rest;
        });

        res.status(200).json({
            status: httpStatusText.SUCCESS,
            data: { users: safeUsers }
        });
    } catch (error) {
        res.status(500).json({
            status: httpStatusText.FAIL,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    createUser,
    loginUser,
    getAllUsers
};

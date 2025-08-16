const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware')
const userController = require('../controllers/user.controller');

router
    .post('/register', userController.createUser)
    .post('/login', userController.loginUser);


router.get('/', authMiddleware, userController.getAllUsers);

module.exports = router;
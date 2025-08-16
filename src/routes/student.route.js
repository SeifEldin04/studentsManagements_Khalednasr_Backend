const studentController = require('../controllers/student.controller');
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth.middleware');

router
    .post('/', authenticate, studentController.createStudent)

router
    .put('/:id', authenticate, studentController.updateStudent)

router
    .get('/', authenticate, studentController.getStudents)
    .get('/:id', authenticate, studentController.getStudentById)

router
    .delete('/:id', authenticate, studentController.deleteStudent)

// router
//     .post('/', authenticate, authorize(['ADMIN']), studentController.createStudent)
//     .put('/:id', authenticate, authorize(['ADMIN']), studentController.updateStudent)
//     .get('/', authenticate, authorize(['ADMIN', 'USER']), studentController.getStudents)
//     .get('/:id', authenticate, authorize(['ADMIN', 'USER']), studentController.getStudentById)
//     .delete('/:id', authenticate, authorize(['ADMIN']), studentController.deleteStudent);

module.exports = router;
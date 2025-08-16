const attendanceController = require('../controllers/attendance.controller');
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth.middleware');

router
    .post('/', authenticate, attendanceController.addOrUpdateAttendance)
    .get('/', authenticate, attendanceController.getAllAttendance)
    .delete('/', authenticate, attendanceController.deleteAttendance);

module.exports = router;
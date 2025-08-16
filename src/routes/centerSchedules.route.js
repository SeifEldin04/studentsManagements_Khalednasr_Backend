const express = require('express');
const router = express.Router();
const centerSchedulesController = require('../controllers/centerSchedules.controller');
const authenticate = require('../middleware/auth.middleware');

router
    .post('/', authenticate, centerSchedulesController.createCenterSchedule);

router
    .get('/', authenticate, centerSchedulesController.getAllCenterSchedules)
    .get('/:center_id', authenticate, centerSchedulesController.getCenterScheduleByCenterId)

router
    .put('/:id', authenticate, centerSchedulesController.updateCenterSchedule)

router
    .delete('/:id', authenticate, centerSchedulesController.deleteCenterSchedule);

module.exports = router;
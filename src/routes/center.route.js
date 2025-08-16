const centerController = require('../controllers/center.controller');
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth.middleware');

router
    .get('/', authenticate, centerController.getAllCenters)
    .get('/:id', authenticate, centerController.getCenterById)

router
    .post('/', authenticate, centerController.createCenter)

router
    .put('/:id', authenticate, centerController.updateCenter)

router
    .delete('/:id', authenticate, centerController.deleteCenter)

module.exports = router;

const examScoresController = require('../controllers/examScores.controller');
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth.middleware');

router
    .post('/', authenticate, examScoresController.addOrUpdateExamScores)

router
    // .get('/', authenticate, examScoresController.getAllExamScores)
    .get('/', authenticate, examScoresController.getAllExamScores);
    
// .get('/:center_id/:grade/:month', examScoresController.getAllExamScoresByCenterIdAndGradeAndMonth)

router
    .delete('/', authenticate, examScoresController.deleteExamScores)

module.exports = router;
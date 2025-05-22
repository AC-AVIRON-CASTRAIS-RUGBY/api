const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.post('/tournaments/:tournamentId/generate-schedule', scheduleController.generateSchedule);
router.get('/tournaments/:tournamentId/', scheduleController.getTournamentSchedule);

module.exports = router;
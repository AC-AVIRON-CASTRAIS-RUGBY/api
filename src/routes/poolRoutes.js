const express = require('express');
const router = express.Router();
const poolController = require('../controllers/poolController');

// Routes avec l'id du tournoi
router.get('/tournaments/:tournamentId', poolController.getAllPoolsByTournament);
router.get('/tournaments/:tournamentId/:id', poolController.getPoolById);
router.post('/tournaments/:tournamentId', poolController.createPool);
router.put('/tournaments/:tournamentId/:id', poolController.updatePool);
router.delete('/tournaments/:tournamentId/:id', poolController.deletePool);

router.get('/tournaments/:tournamentId/:id/standings', poolController.getPoolStandings);
router.get('/tournaments/:tournamentId/standings/all', poolController.getAllPoolsStandingsByTournament);

router.get('/tournaments/:tournamentId/:id/teams', poolController.getTeamsByPoolId);
router.post('/tournaments/:tournamentId/:id/teams', poolController.addTeamToPool);
router.delete('/tournaments/:tournamentId/:id/teams/:teamId', poolController.removeTeamFromPool);

module.exports = router;
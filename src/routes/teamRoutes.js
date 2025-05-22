const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

// Routes pour les équipes dans le contexte d'un tournoi spécifique
router.get('/:tournamentId', teamController.getAllTeams);
router.get('/:tournamentId/teams/:id', teamController.getTeamById);
router.post('/:tournamentId/teams', teamController.createTeam);
router.put('/:tournamentId/teams/:id', teamController.updateTeam);
router.delete('/:tournamentId/teams/:id', teamController.deleteTeam);

router.get('/:tournamentId/teams/:id/games', teamController.getGamesByTeamId);
router.get('/:tournamentId/teams/:id/locker-room', teamController.getLockerRoomByTeamId);

module.exports = router;
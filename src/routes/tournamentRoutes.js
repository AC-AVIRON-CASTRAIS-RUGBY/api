const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');

router.get('/', tournamentController.getAllTournaments);
router.get('/:id', tournamentController.getTournamentById);
router.post('/', tournamentController.createTournament);

module.exports = router;
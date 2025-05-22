const express = require('express');
const router = express.Router();
const refereeController = require('../controllers/refereeController');

router.get('/', refereeController.getAllReferees);
router.get('/:id', refereeController.getRefereeById);
router.get('/uuid/:uuid', refereeController.getRefereeByUUID);
router.post('/', refereeController.createReferee);
router.put('/:id', refereeController.updateReferee);
router.delete('/:id', refereeController.deleteReferee);

router.get('/:id/games', refereeController.getGamesByRefereeId);
router.get('/:id/tournaments', refereeController.getTournamentsByRefereeId);
router.get('/tournaments/:tournamentId', refereeController.getRefereesByTournamentIdDirect);

module.exports = router;
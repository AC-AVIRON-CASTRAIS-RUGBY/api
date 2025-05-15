const express = require('express');
const router = express.Router();
const phaseController = require('../controllers/phaseController');

router.get('/', phaseController.getAllPhases);
router.get('/:id', phaseController.getPhaseById);
router.post('/', phaseController.createPhase);
router.put('/:id', phaseController.updatePhase);
router.delete('/:id', phaseController.deletePhase);

router.get('/:id/pools', phaseController.getPoolsByPhaseId);

module.exports = router;
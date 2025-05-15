const express = require('express');
const router = express.Router();
const poolController = require('../controllers/poolController');

router.get('/', poolController.getAllPools);
router.get('/:id', poolController.getPoolById);
router.post('/', poolController.createPool);
router.put('/:id', poolController.updatePool);
router.delete('/:id', poolController.deletePool);

router.get('/:id/teams', poolController.getTeamsByPoolId);

module.exports = router;
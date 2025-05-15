const express = require('express');
const router = express.Router();
const lockerRoomController = require('../controllers/lockerRoomController');

router.get('/', lockerRoomController.getAllLockerRooms);
router.get('/:id', lockerRoomController.getLockerRoomById);
router.post('/', lockerRoomController.createLockerRoom);
router.put('/:id', lockerRoomController.updateLockerRoom);
router.delete('/:id', lockerRoomController.deleteLockerRoom);

router.get('/team/:teamId', lockerRoomController.getLockerRoomByTeamId);

module.exports = router;
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.get('/verify/:uuid', authController.verifyAuth);
router.post('/update-password', authController.updatePassword);
router.post('/referees/:refereeId/account', authController.createRefereeAccount);

module.exports = router;
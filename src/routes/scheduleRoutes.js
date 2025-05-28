const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

/**
 * @swagger
 * paths:
 *   /api/schedule/tournaments/{tournamentId}/generate-schedule:
 *     post:
 *       summary: Génère le calendrier des matchs pour un tournoi
 *       tags: [Calendrier]
 *       parameters:
 *         - in: path
 *           name: tournamentId
 *           required: true
 *           schema:
 *             type: integer
 *           description: ID du tournoi
 *       responses:
 *         200:
 *           description: Calendrier généré avec succès
 *         404:
 *           description: Tournoi non trouvé
 *         500:
 *           description: Erreur serveur
 */
router.post('/tournaments/:tournamentId/generate-schedule', scheduleController.generateSchedule);

/**
 * @swagger
 * paths:
 *   /api/schedule/tournaments/{tournamentId}:
 *     get:
 *       summary: Récupère le calendrier des matchs d'un tournoi
 *       tags: [Calendrier]
 *       parameters:
 *         - in: path
 *           name: tournamentId
 *           required: true
 *           schema:
 *             type: integer
 *           description: ID du tournoi
 *       responses:
 *         200:
 *           description: Calendrier récupéré avec succès
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   tournamentId:
 *                     type: integer
 *                   tournamentName:
 *                     type: string
 *                   schedule:
 *                     type: object
 *         404:
 *           description: Tournoi non trouvé
 *         500:
 *           description: Erreur serveur
 */
router.get('/tournaments/:tournamentId', scheduleController.getTournamentSchedule);

module.exports = router;
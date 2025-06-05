const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

/**
 * @swagger
 * /schedule/tournaments/{tournamentId}/generate:
 *   post:
 *     summary: Génère automatiquement le calendrier des matchs d'un tournoi
 *     tags: [Calendrier]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du tournoi
 *     responses:
 *       200:
 *         description: Calendrier généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 gamesUpdated:
 *                   type: integer
 *       404:
 *         description: Tournoi non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post('/tournaments/:tournamentId/generate', scheduleController.generateSchedule);

/**
 * @swagger
 * /schedule/tournaments/{tournamentId}:
 *   get:
 *     summary: Récupère le calendrier complet d'un tournoi
 *     tags: [Calendrier]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du tournoi
 *     responses:
 *       200:
 *         description: Calendrier récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tournamentId:
 *                   type: integer
 *                 tournamentName:
 *                   type: string
 *                 schedule:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         gameId:
 *                           type: integer
 *                         startTime:
 *                           type: string
 *                           format: date-time
 *                         team1:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                             score:
 *                               type: integer
 *                         team2:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                             score:
 *                               type: integer
 *                         referee:
 *                           type: string
 *                         field:
 *                           type: string
 *                         isCompleted:
 *                           type: boolean
 *       404:
 *         description: Tournoi non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/tournaments/:tournamentId', scheduleController.getTournamentSchedule);

module.exports = router;
const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Récupère tous les matchs
 *     tags: [Matchs]
 *     responses:
 *       200:
 *         description: Matchs récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', gameController.getAllGames);

/**
 * @swagger
 * /games:
 *   post:
 *     summary: Crée un nouveau match
 *     tags: [Matchs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Team1_Id
 *               - Team2_Id
 *               - Referee_Id
 *               - Pool_Id
 *             properties:
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 description: Heure de début du match
 *               Team1_Id:
 *                 type: integer
 *                 description: ID de l'équipe 1
 *               Team2_Id:
 *                 type: integer
 *                 description: ID de l'équipe 2
 *               Referee_Id:
 *                 type: integer
 *                 description: ID de l'arbitre
 *               Pool_Id:
 *                 type: integer
 *                 description: ID de la poule
 *               Tournament_Id:
 *                 type: integer
 *                 description: ID du tournoi
 *     responses:
 *       201:
 *         description: Match créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Match créé avec succès"
 *                 gameId:
 *                   type: integer
 *                   example: 123
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/', gameController.createGame);

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Récupère un match par son ID
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du match
 *     responses:
 *       200:
 *         description: Match récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Match non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', gameController.getGameById);

/**
 * @swagger
 * /games/{id}:
 *   put:
 *     summary: Met à jour un match
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du match
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 description: Heure de début du match
 *               Team1_Id:
 *                 type: integer
 *                 description: ID de l'équipe 1
 *               Team2_Id:
 *                 type: integer
 *                 description: ID de l'équipe 2
 *               Team1_Score:
 *                 type: integer
 *                 description: Score de l'équipe 1
 *               Team2_Score:
 *                 type: integer
 *                 description: Score de l'équipe 2
 *               is_completed:
 *                 type: boolean
 *                 description: Match terminé ou non
 *               Referee_Id:
 *                 type: integer
 *                 description: ID de l'arbitre
 *               Pool_Id:
 *                 type: integer
 *                 description: ID de la poule
 *               Field_Id:
 *                 type: integer
 *                 description: ID du terrain
 *     responses:
 *       200:
 *         description: Match mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Match mis à jour avec succès"
 *       404:
 *         description: Match non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', gameController.updateGame);

/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     summary: Supprime un match
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du match
 *     responses:
 *       200:
 *         description: Match supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Match supprimé avec succès"
 *       404:
 *         description: Match non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', gameController.deleteGame);

/**
 * @swagger
 * /games/pool/{poolId}:
 *   get:
 *     summary: Récupère tous les matchs d'une poule
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: poolId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la poule
 *     responses:
 *       200:
 *         description: Matchs récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *       500:
 *         description: Erreur serveur
 */
router.get('/pool/:poolId', gameController.getGamesByPoolId);

/**
 * @swagger
 * /games/pool/{poolId}/generate:
 *   post:
 *     summary: Génère automatiquement tous les matchs d'une poule
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: poolId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la poule
 *       - in: query
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du tournoi
 *     responses:
 *       201:
 *         description: Matchs générés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "5 matchs générés avec succès pour la poule 1"
 *                 gamesCreated:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Données invalides ou pas assez d'équipes
 *       404:
 *         description: Poule non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.post('/pool/:poolId/generate', gameController.generatePoolGames);

module.exports = router;
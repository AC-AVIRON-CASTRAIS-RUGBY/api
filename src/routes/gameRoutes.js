const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

/**
 * @swagger
 * /api/games:
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
 * /api/games:
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
 *               - Pool_Id
 *             properties:
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               Team1_Id:
 *                 type: integer
 *               Team2_Id:
 *                 type: integer
 *               Team1_Score:
 *                 type: integer
 *               Team2_Score:
 *                 type: integer
 *               is_completed:
 *                 type: boolean
 *               Referee_Id:
 *                 type: integer
 *               Pool_Id:
 *                 type: integer
 *               Field_Id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Match créé avec succès
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
 *               Team1_Id:
 *                 type: integer
 *               Team2_Id:
 *                 type: integer
 *               Team1_Score:
 *                 type: integer
 *               Team2_Score:
 *                 type: integer
 *               is_completed:
 *                 type: boolean
 *               Referee_Id:
 *                 type: integer
 *               Pool_Id:
 *                 type: integer
 *               Field_Id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Match mis à jour avec succès
 *       404:
 *         description: Match non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', gameController.updateGame);

/**
 * @swagger
 * /api/games/{id}:
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
 *       404:
 *         description: Match non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', gameController.deleteGame);

/**
 * @swagger
 * /api/games/pool/{poolId}:
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
 * /api/games/pool/{poolId}/generate:
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
 *                 gamesCreated:
 *                   type: integer
 *       400:
 *         description: Pas assez d'équipes dans la poule ou aucun arbitre disponible
 *       404:
 *         description: Poule non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.post('/pool/:poolId/generate', gameController.generatePoolGames);

module.exports = router;
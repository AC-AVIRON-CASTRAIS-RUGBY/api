const express = require('express');
const router = express.Router();
const refereeController = require('../controllers/refereeController');

/**
 * @swagger
 * /referees:
 *   get:
 *     summary: Récupère tous les arbitres
 *     tags: [Arbitres]
 *     responses:
 *       200:
 *         description: Liste des arbitres
 *   post:
 *     summary: Crée un nouvel arbitre
 *     tags: [Arbitres]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lastName
 *               - firstName
 *               - password
 *               - tournamentId
 *             properties:
 *               lastName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               password:
 *                 type: string
 *               tournamentId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Arbitre créé avec succès
 */
router.get('/', refereeController.getAllReferees);
router.post('/', refereeController.createReferee);

/**
 * @swagger
 * /referees/{id}:
 *   get:
 *     summary: Récupère un arbitre par ID
 *     tags: [Arbitres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Arbitre trouvé
 *   put:
 *     summary: Met à jour un arbitre
 *     tags: [Arbitres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lastName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               loginUUID:
 *                 type: string
 *               tournamentId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Arbitre mis à jour
 *   delete:
 *     summary: Supprime un arbitre
 *     tags: [Arbitres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Arbitre supprimé
 */
router.get('/:id', refereeController.getRefereeById);
router.put('/:id', refereeController.updateReferee);
router.delete('/:id', refereeController.deleteReferee);

/**
 * @swagger
 * /referees/{id}/games:
 *   get:
 *     summary: Récupère tous les matchs assignés à un arbitre
 *     tags: [Arbitres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'arbitre
 *     responses:
 *       200:
 *         description: Liste des matchs de l'arbitre récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Game_Id:
 *                     type: integer
 *                   start_time:
 *                     type: string
 *                     format: date-time
 *                   Team1_Id:
 *                     type: integer
 *                   Team2_Id:
 *                     type: integer
 *                   Team1_Score:
 *                     type: integer
 *                   Team2_Score:
 *                     type: integer
 *                   is_completed:
 *                     type: boolean
 *                   Pool_Id:
 *                     type: integer
 *                   Tournament_Id:
 *                     type: integer
 *                   team1_name:
 *                     type: string
 *                   team2_name:
 *                     type: string
 *                   pool_name:
 *                     type: string
 *       404:
 *         description: Arbitre non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id/games', refereeController.getGamesByRefereeId);

/**
 * @swagger
 * /referees/tournaments/{tournamentId}:
 *   get:
 *     summary: Récupère tous les arbitres d'un tournoi
 *     tags: [Arbitres]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des arbitres du tournoi
 */
router.get('/tournaments/:tournamentId', refereeController.getRefereesByTournamentIdDirect);

/**
 * @swagger
 * /referees/uuid/{uuid}:
 *   get:
 *     summary: Récupère un arbitre par son UUID
 *     tags: [Arbitres]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID de l'arbitre
 *     responses:
 *       200:
 *         description: Arbitre trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Referee'
 *       404:
 *         description: Arbitre non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/uuid/:uuid', refereeController.getRefereeByUUID);

module.exports = router;

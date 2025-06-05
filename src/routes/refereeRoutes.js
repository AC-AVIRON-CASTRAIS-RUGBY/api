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
 *         description: Arbitres récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Referee'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', refereeController.getAllReferees);

/**
 * @swagger
 * /referees:
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
 *               - last_name
 *               - first_name
 *               - Tournament_Id
 *             properties:
 *               last_name:
 *                 type: string
 *               first_name:
 *                 type: string
 *               Tournament_Id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Arbitre créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 refereeId:
 *                   type: integer
 *                 uuid:
 *                   type: string
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/', refereeController.createReferee);

/**
 * @swagger
 * /referees/{id}:
 *   get:
 *     summary: Récupère un arbitre par son ID
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
 *         description: Arbitre récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Referee'
 *       404:
 *         description: Arbitre non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', refereeController.getRefereeById);

/**
 * @swagger
 * /referees/{id}:
 *   put:
 *     summary: Met à jour un arbitre
 *     tags: [Arbitres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'arbitre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               last_name:
 *                 type: string
 *               first_name:
 *                 type: string
 *               loginUUID:
 *                 type: string
 *               Tournament_Id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Arbitre mis à jour avec succès
 *       404:
 *         description: Arbitre non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', refereeController.updateReferee);

/**
 * @swagger
 * /referees/{id}:
 *   delete:
 *     summary: Supprime un arbitre
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
 *         description: Arbitre supprimé avec succès
 *       404:
 *         description: Arbitre non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', refereeController.deleteReferee);

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
 *         description: Arbitre récupéré avec succès
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

/**
 * @swagger
 * /referees/{id}/games:
 *   get:
 *     summary: Récupère tous les matchs d'un arbitre
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
router.get('/:id/games', refereeController.getGamesByRefereeId);

/**
 * @swagger
 * /referees/{id}/tournaments:
 *   get:
 *     summary: Récupère tous les tournois d'un arbitre
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
 *         description: Tournois récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Tournament_Id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   start_date:
 *                     type: string
 *                     format: date-time
 *                   location:
 *                     type: string
 *                   teams_count:
 *                     type: integer
 *                   pools_count:
 *                     type: integer
 *                   games_count:
 *                     type: integer
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id/tournaments', refereeController.getTournamentsByRefereeId);

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
 *         description: ID du tournoi
 *     responses:
 *       200:
 *         description: Arbitres récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Referee'
 *       404:
 *         description: Aucun arbitre trouvé pour ce tournoi
 *       500:
 *         description: Erreur serveur
 */
router.get('/tournaments/:tournamentId', refereeController.getRefereesByTournamentIdDirect);

module.exports = router;

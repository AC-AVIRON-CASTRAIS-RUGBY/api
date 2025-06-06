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
 *             $ref: '#/components/schemas/Referee'
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

module.exports = router;

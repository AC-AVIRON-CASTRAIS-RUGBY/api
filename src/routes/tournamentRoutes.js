const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');

/**
 * @swagger
 * /api/tournaments:
 *   get:
 *     summary: Récupère tous les tournois
 *     tags: [Tournois]
 *     responses:
 *       200:
 *         description: Liste des tournois récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tournament'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', tournamentController.getAllTournaments);

/**
 * @swagger
 * /api/tournaments:
 *   post:
 *     summary: Crée un nouveau tournoi
 *     tags: [Tournois]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - start_date
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               game_duration:
 *                 type: integer
 *               break_time:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tournoi créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/', tournamentController.createTournament);

/**
 * @swagger
 * /api/tournaments/{id}:
 *   get:
 *     summary: Récupère un tournoi par son ID
 *     tags: [Tournois]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du tournoi
 *     responses:
 *       200:
 *         description: Tournoi récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tournament'
 *       404:
 *         description: Tournoi non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', tournamentController.getTournamentById);

/**
 * @swagger
 * /api/tournaments/{id}:
 *   put:
 *     summary: Met à jour un tournoi
 *     tags: [Tournois]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du tournoi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               game_duration:
 *                 type: integer
 *               break_time:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Tournoi mis à jour avec succès
 *       404:
 *         description: Tournoi non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', tournamentController.updateTournament);

/**
 * @swagger
 * /api/tournaments/{id}:
 *   delete:
 *     summary: Supprime un tournoi
 *     tags: [Tournois]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du tournoi
 *     responses:
 *       200:
 *         description: Tournoi supprimé avec succès
 *       404:
 *         description: Tournoi non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', tournamentController.deleteTournament);

module.exports = router;
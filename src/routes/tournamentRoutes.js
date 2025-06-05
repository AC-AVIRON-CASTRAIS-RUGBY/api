const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Tournament:
 *       type: object
 *       required:
 *         - name
 *         - start_date
 *         - location
 *       properties:
 *         Tournament_Id:
 *           type: integer
 *           description: ID auto-généré du tournoi
 *         name:
 *           type: string
 *           description: Nom du tournoi
 *         description:
 *           type: string
 *           description: Description du tournoi
 *         image:
 *           type: string
 *           description: URL de l'image du tournoi
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: Date et heure de début du tournoi
 *         location:
 *           type: string
 *           description: Lieu du tournoi
 *         break_time:
 *           type: integer
 *           default: 5
 *           description: Temps de pause entre les matchs (en minutes)
 *         points_win:
 *           type: integer
 *           default: 3
 *           description: Points attribués pour une victoire
 *         points_draw:
 *           type: integer
 *           default: 1
 *           description: Points attribués pour un match nul
 *         points_loss:
 *           type: integer
 *           default: 0
 *           description: Points attribués pour une défaite
 */

/**
 * @swagger
 * /tournaments:
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
 * /tournaments:
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
 *               break_time:
 *                 type: integer
 *                 default: 5
 *               points_win:
 *                 type: integer
 *                 default: 3
 *               points_draw:
 *                 type: integer
 *                 default: 1
 *               points_loss:
 *                 type: integer
 *                 default: 0
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
 * /tournaments/{id}:
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
 *         description: Tournoi trouvé
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
 * /tournaments/{id}:
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
 *               break_time:
 *                 type: integer
 *               points_win:
 *                 type: integer
 *               points_draw:
 *                 type: integer
 *               points_loss:
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
 * /tournaments/{id}:
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
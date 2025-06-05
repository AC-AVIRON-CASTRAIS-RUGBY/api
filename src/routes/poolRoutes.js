const express = require('express');
const router = express.Router();
const poolController = require('../controllers/poolController');

/**
 * @swagger
 * /pools/tournaments/{tournamentId}:
 *   get:
 *     summary: Récupère toutes les poules d'un tournoi
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du tournoi
 *     responses:
 *       200:
 *         description: Poules récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pool'
 *       500:
 *         description: Erreur serveur
 */
router.get('/tournaments/:tournamentId', poolController.getAllPoolsByTournament);

/**
 * @swagger
 * /pools/tournaments/{tournamentId}:
 *   post:
 *     summary: Crée une nouvelle poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: tournamentId
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
 *             required:
 *               - name
 *               - Phase_Id
 *             properties:
 *               name:
 *                 type: string
 *               Phase_Id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Poule créée avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/tournaments/:tournamentId', poolController.createPool);

/**
 * @swagger
 * /pools/tournaments/{tournamentId}/{id}:
 *   get:
 *     summary: Récupère une poule par son ID
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du tournoi
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la poule
 *     responses:
 *       200:
 *         description: Poule récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pool'
 *       404:
 *         description: Poule non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/tournaments/:tournamentId/:id', poolController.getPoolById);

/**
 * @swagger
 * /pools/tournaments/{tournamentId}/{id}:
 *   put:
 *     summary: Met à jour une poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du tournoi
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la poule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               Phase_Id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Poule mise à jour avec succès
 *       404:
 *         description: Poule non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put('/tournaments/:tournamentId/:id', poolController.updatePool);

/**
 * @swagger
 * /pools/tournaments/{tournamentId}/{id}:
 *   delete:
 *     summary: Supprime une poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du tournoi
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la poule
 *     responses:
 *       200:
 *         description: Poule supprimée avec succès
 *       404:
 *         description: Poule non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/tournaments/:tournamentId/:id', poolController.deletePool);

/**
 * @swagger
 * /pools/tournaments/{tournamentId}/{id}/standings:
 *   get:
 *     summary: Récupère le classement d'une poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du tournoi
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la poule
 *     responses:
 *       200:
 *         description: Classement récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Team_Id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   logo:
 *                     type: string
 *                   matchesPlayed:
 *                     type: integer
 *                   wins:
 *                     type: integer
 *                   losses:
 *                     type: integer
 *                   draws:
 *                     type: integer
 *                   points:
 *                     type: integer
 *       404:
 *         description: Poule non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/tournaments/:tournamentId/:id/standings', poolController.getPoolStandings);

/**
 * @swagger
 * /pools/tournaments/{tournamentId}/standings/all:
 *   get:
 *     summary: Récupère le classement général de toutes les poules d'un tournoi
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du tournoi
 *     responses:
 *       200:
 *         description: Classement général récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Team_Id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   logo:
 *                     type: string
 *                   matchesPlayed:
 *                     type: integer
 *                   wins:
 *                     type: integer
 *                   losses:
 *                     type: integer
 *                   draws:
 *                     type: integer
 *                   points:
 *                     type: integer
 *                   rank:
 *                     type: integer
 *       404:
 *         description: Aucune équipe trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/tournaments/:tournamentId/standings/all', poolController.getAllPoolsStandingsByTournament);

/**
 * @swagger
 * /pools/tournaments/{tournamentId}/{id}/teams:
 *   get:
 *     summary: Récupère toutes les équipes d'une poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du tournoi
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la poule
 *     responses:
 *       200:
 *         description: Équipes récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Team'
 *       500:
 *         description: Erreur serveur
 */
router.get('/tournaments/:tournamentId/:id/teams', poolController.getTeamsByPoolId);

/**
 * @swagger
 * /pools/tournaments/{tournamentId}/{id}/teams:
 *   post:
 *     summary: Ajoute une équipe à une poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du tournoi
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la poule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamId
 *             properties:
 *               teamId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Équipe ajoutée à la poule avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Poule ou équipe non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.post('/tournaments/:tournamentId/:id/teams', poolController.addTeamToPool);

/**
 * @swagger
 * /pools/tournaments/{tournamentId}/{id}/teams/{teamId}:
 *   delete:
 *     summary: Retire une équipe d'une poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du tournoi
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la poule
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'équipe
 *     responses:
 *       200:
 *         description: Équipe retirée de la poule avec succès
 *       404:
 *         description: Association poule-équipe non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/tournaments/:tournamentId/:id/teams/:teamId', poolController.removeTeamFromPool);

module.exports = router;
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
 *     responses:
 *       200:
 *         description: Liste des poules récupérée avec succès
 *   post:
 *     summary: Crée une nouvelle poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
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
 *               Category_Id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Poule créée avec succès
 */
router.get('/tournaments/:tournamentId', poolController.getAllPoolsByTournament);
router.post('/tournaments/:tournamentId', poolController.createPool);

/**
 * @swagger
 * /pools/tournaments/{tournamentId}/{id}:
 *   get:
 *     summary: Récupère une poule par ID
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Poule récupérée avec succès
 *   put:
 *     summary: Met à jour une poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
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
 *             $ref: '#/components/schemas/Pool'
 *     responses:
 *       200:
 *         description: Poule mise à jour avec succès
 *   delete:
 *     summary: Supprime une poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Poule supprimée avec succès
 */
router.get('/tournaments/:tournamentId/:id', poolController.getPoolById);
router.put('/tournaments/:tournamentId/:id', poolController.updatePool);
router.delete('/tournaments/:tournamentId/:id', poolController.deletePool);

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
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Équipes de la poule récupérées avec succès
 *   post:
 *     summary: Ajoute une équipe à la poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
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
 *             required:
 *               - teamId
 *             properties:
 *               teamId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Équipe ajoutée à la poule avec succès
 */
router.get('/tournaments/:tournamentId/:id/teams', poolController.getTeamsByPoolId);
router.post('/tournaments/:tournamentId/:id/teams', poolController.addTeamToPool);

/**
 * @swagger
 * /pools/tournaments/{tournamentId}/{id}/teams/{teamId}:
 *   delete:
 *     summary: Retire une équipe de la poule
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Équipe retirée de la poule avec succès
 */
router.delete('/tournaments/:tournamentId/:id/teams/:teamId', poolController.removeTeamFromPool);

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
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Classement de la poule récupéré avec succès
 */
router.get('/tournaments/:tournamentId/:id/standings', poolController.getPoolStandings);

/**
 * @swagger
 * /pools/tournaments/{tournamentId}/standings:
 *   get:
 *     summary: Récupère le classement général de toutes les poules d'un tournoi
 *     tags: [Poules]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Classement général récupéré avec succès
 */
router.get('/tournaments/standings/:tournamentId/', poolController.getTournamentStandings);

module.exports = router;

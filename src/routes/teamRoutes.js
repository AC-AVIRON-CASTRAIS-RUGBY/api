const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const playerController = require('../controllers/playerController');

/**
 * @swagger
 * /api/teams/{tournamentId}:
 *   get:
 *     summary: Récupère toutes les équipes d'un tournoi
 *     tags: [Équipes]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du tournoi
 *     responses:
 *       200:
 *         description: Liste des équipes récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Team'
 *       500:
 *         description: Erreur serveur
 */
router.get('/:tournamentId', teamController.getAllTeams);

/**
 * @swagger
 * /api/teams/{tournamentId}/teams/{id}:
 *   get:
 *     summary: Récupère une équipe par son ID
 *     tags: [Équipes]
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
 *         description: ID de l'équipe
 *     responses:
 *       200:
 *         description: Équipe récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       404:
 *         description: Équipe non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:tournamentId/teams/:id', teamController.getTeamById);

/**
 * @swagger
 * /api/teams/{tournamentId}/teams:
 *   post:
 *     summary: Crée une nouvelle équipe
 *     tags: [Équipes]
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
 *             properties:
 *               name:
 *                 type: string
 *               logo:
 *                 type: string
 *               age_category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Équipe créée avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/:tournamentId/teams', teamController.createTeam);

/**
 * @swagger
 * /api/teams/{tournamentId}/teams/{id}:
 *   put:
 *     summary: Met à jour une équipe
 *     tags: [Équipes]
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
 *         description: ID de l'équipe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               logo:
 *                 type: string
 *               age_category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Équipe mise à jour avec succès
 *       404:
 *         description: Équipe non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put('/:tournamentId/teams/:id', teamController.updateTeam);

/**
 * @swagger
 * /api/teams/{tournamentId}/teams/{id}:
 *   delete:
 *     summary: Supprime une équipe
 *     tags: [Équipes]
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
 *         description: ID de l'équipe
 *     responses:
 *       200:
 *         description: Équipe supprimée avec succès
 *       404:
 *         description: Équipe non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:tournamentId/teams/:id', teamController.deleteTeam);

/**
 * @swagger
 * /api/teams/{tournamentId}/teams/{id}/games:
 *   get:
 *     summary: Récupère tous les matchs d'une équipe
 *     tags: [Équipes]
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
 *         description: ID de l'équipe
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
router.get('/:tournamentId/teams/:id/games', teamController.getGamesByTeamId);

/**
 * @swagger
 * /api/teams/{tournamentId}/teams/{id}/locker-room:
 *   get:
 *     summary: Récupère le vestiaire d'une équipe
 *     tags: [Équipes]
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
 *         description: ID de l'équipe
 *     responses:
 *       200:
 *         description: Vestiaire récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LockerRoom'
 *       404:
 *         description: Vestiaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:tournamentId/teams/:id/locker-room', teamController.getLockerRoomByTeamId);

/**
 * @swagger
 * /api/teams/{tournamentId}/{teamId}/players:
 *   get:
 *     summary: Récupère tous les joueurs d'une équipe
 *     tags: [Joueurs]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du tournoi
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'équipe
 *     responses:
 *       200:
 *         description: Joueurs récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Player'
 *       500:
 *         description: Erreur serveur
 */
router.get('/:tournamentId/:teamId/players', playerController.getPlayersByTeamId);

/**
 * @swagger
 * /api/teams/{tournamentId}/{teamId}/players:
 *   post:
 *     summary: Crée un nouveau joueur pour une équipe
 *     tags: [Joueurs]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du tournoi
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'équipe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               number:
 *                 type: integer
 *               position:
 *                 type: string
 *     responses:
 *       201:
 *         description: Joueur créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/:tournamentId/:teamId/players', playerController.createPlayer);

module.exports = router;

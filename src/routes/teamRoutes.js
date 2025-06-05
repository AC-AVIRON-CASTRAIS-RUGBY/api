const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const playerController = require('../controllers/playerController');

/**
 * @swagger
 * /teams/tournaments/{tournamentId}:
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
router.get('/tournaments/:tournamentId', teamController.getAllTeams);

/**
 * @swagger
 * /teams/tournaments/{tournamentId}:
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
 *               paid:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Équipe créée avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/tournaments/:tournamentId', teamController.createTeam);

/**
 * @swagger
 * /teams/tournaments/{tournamentId}/{id}:
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
router.get('/tournaments/:tournamentId/:id', teamController.getTeamById);

/**
 * @swagger
 * /teams/tournaments/{tournamentId}/{id}:
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
 *               paid:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Équipe mise à jour avec succès
 *       404:
 *         description: Équipe non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put('/tournaments/:tournamentId/:id', teamController.updateTeam);

/**
 * @swagger
 * /teams/tournaments/{tournamentId}/{id}:
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
router.delete('/tournaments/:tournamentId/:id', teamController.deleteTeam);

/**
 * @swagger
 * /teams/tournaments/{tournamentId}/{id}/games:
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
router.get('/tournaments/:tournamentId/:id/games', teamController.getGamesByTeamId);

/**
 * @swagger
 * /teams/tournaments/{tournamentId}/{id}/locker-room:
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
 *         description: Aucun vestiaire trouvé pour cette équipe
 *       500:
 *         description: Erreur serveur
 */
router.get('/tournaments/:tournamentId/:id/locker-room', teamController.getLockerRoomByTeamId);

/**
 * @swagger
 * /teams/tournaments/{tournamentId}/{teamId}/players:
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
router.get('/tournaments/:tournamentId/:teamId/players', playerController.getPlayersByTeamId);

/**
 * @swagger
 * /teams/tournaments/{tournamentId}/{teamId}/players:
 *   post:
 *     summary: Crée un nouveau joueur
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
 *               present:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Joueur créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/tournaments/:tournamentId/:teamId/players', playerController.createPlayer);

/**
 * @swagger
 * /teams/tournaments/{tournamentId}/{teamId}/players/{id}:
 *   get:
 *     summary: Récupère un joueur par son ID
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
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du joueur
 *     responses:
 *       200:
 *         description: Joueur récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
 *       404:
 *         description: Joueur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/tournaments/:tournamentId/:teamId/players/:id', playerController.getPlayerById);

/**
 * @swagger
 * /teams/tournaments/{tournamentId}/{teamId}/players/{id}:
 *   put:
 *     summary: Met à jour un joueur
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
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du joueur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               number:
 *                 type: integer
 *               position:
 *                 type: string
 *               present:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Joueur mis à jour avec succès
 *       404:
 *         description: Joueur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/tournaments/:tournamentId/:teamId/players/:id', playerController.updatePlayer);

/**
 * @swagger
 * /teams/tournaments/{tournamentId}/{teamId}/players/{id}:
 *   delete:
 *     summary: Supprime un joueur
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
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du joueur
 *     responses:
 *       200:
 *         description: Joueur supprimé avec succès
 *       404:
 *         description: Joueur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/tournaments/:tournamentId/:teamId/players/:id', playerController.deletePlayer);

module.exports = router;

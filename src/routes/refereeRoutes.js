const express = require('express');
const router = express.Router();
const refereeController = require('../controllers/refereeController');

console.info('👨‍⚖️ Module refereeRoutes initialisé');

// Middleware de debug spécifique aux arbitres
router.use((req, res, next) => {
    console.info(`👨‍⚖️ Route arbitre appelée: ${req.method} ${req.originalUrl}`);
    next();
});

/**
 * @swagger
 * /api/referees:
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
router.get('/', (req, res, next) => {
    console.info('📋 Récupération de tous les arbitres');
    refereeController.getAllReferees(req, res, next);
});

/**
 * @swagger
 * /api/referees:
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
router.post('/', (req, res, next) => {
    console.info('➕ Création d\'un nouvel arbitre');
    refereeController.createReferee(req, res, next);
});

/**
 * @swagger
 * /api/referees/{id}:
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
router.get('/:id', (req, res, next) => {
    console.info(`🎯 Récupération de l'arbitre ${req.params.id}`);
    refereeController.getRefereeById(req, res, next);
});

/**
 * @swagger
 * /api/referees/{id}:
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
router.put('/:id', (req, res, next) => {
    console.info(`✏️ Mise à jour de l'arbitre ${req.params.id}`);
    refereeController.updateReferee(req, res, next);
});

/**
 * @swagger
 * /api/referees/{id}:
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
router.delete('/:id', (req, res, next) => {
    console.info(`🗑️ Suppression de l'arbitre ${req.params.id}`);
    refereeController.deleteReferee(req, res, next);
});

/**
 * @swagger
 * /api/referees/uuid/{uuid}:
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
router.get('/uuid/:uuid', (req, res, next) => {
    console.info(`🔑 Récupération de l'arbitre par UUID: ${req.params.uuid}`);
    refereeController.getRefereeByUUID(req, res, next);
});

/**
 * @swagger
 * /api/referees/{id}/games:
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
router.get('/:id/games', (req, res, next) => {
    console.info(`🏟️ Récupération des matchs de l'arbitre ${req.params.id}`);
    refereeController.getGamesByRefereeId(req, res, next);
});

/**
 * @swagger
 * /api/referees/{id}/tournaments:
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
router.get('/:id/tournaments', (req, res, next) => {
    console.info(`🏆 Récupération des tournois de l'arbitre ${req.params.id}`);
    refereeController.getTournamentsByRefereeId(req, res, next);
});

/**
 * @swagger
 * /api/referees/tournaments/{tournamentId}:
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
router.get('/tournaments/:tournamentId', (req, res, next) => {
    console.info(`👨‍⚖️ Récupération des arbitres du tournoi ${req.params.tournamentId}`);
    refereeController.getRefereesByTournamentIdDirect(req, res, next);
});

console.info('👨‍⚖️ Routes arbitres configurées');

module.exports = router;
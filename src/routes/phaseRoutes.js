const express = require('express');
const router = express.Router();
const phaseController = require('../controllers/phaseController');

//Récupérer toutes les phases d'un tournoi

/**
 * @swagger
 * /phases/tournaments/{tournamentId}:
 *   get:
 *     summary: Récupère toutes les phases d'un tournoi
 *     tags: [Phases]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du tournoi
 *     responses:
 *       200:
 *         description: Phases récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Phase'
 *       500:
 *         description: Erreur serveur
 */
router.get('/tournaments/:tournamentId', phaseController.getPhasesByTournamentId);

/**
 * @swagger
 * /phases/tournaments/{tournamentId}:
 *   post:
 *     summary: Crée une nouvelle phase
 *     tags: [Phases]
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
 *                 description: Nom de la phase
 *     responses:
 *       201:
 *         description: Phase créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 phaseId:
 *                   type: integer
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/tournaments/:tournamentId', phaseController.createPhase);

/**
 * @swagger
 * /phases/tournaments/{tournamentId}/{id}:
 *   get:
 *     summary: Récupère une phase par son ID
 *     tags: [Phases]
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
 *         description: ID de la phase
 *     responses:
 *       200:
 *         description: Phase récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Phase'
 *       404:
 *         description: Phase non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/tournaments/:tournamentId/:id', phaseController.getPhaseById);

/**
 * @swagger
 * /phases/tournaments/{tournamentId}/{id}:
 *   put:
 *     summary: Met à jour une phase
 *     tags: [Phases]
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
 *         description: ID de la phase
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom de la phase
 *     responses:
 *       200:
 *         description: Phase mise à jour avec succès
 *       404:
 *         description: Phase non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put('/tournaments/:tournamentId/:id', phaseController.updatePhase);

/**
 * @swagger
 * /phases/tournaments/{tournamentId}/{id}:
 *   delete:
 *     summary: Supprime une phase
 *     tags: [Phases]
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
 *         description: ID de la phase
 *     responses:
 *       200:
 *         description: Phase supprimée avec succès
 *       404:
 *         description: Phase non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/tournaments/:tournamentId/:id', phaseController.deletePhase);

/**
 * @swagger
 * /phases/tournaments/{tournamentId}/{id}/pools:
 *   get:
 *     summary: Récupère toutes les poules d'une phase
 *     tags: [Phases]
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
 *         description: ID de la phase
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
router.get('/tournaments/:tournamentId/:id/pools', phaseController.getPoolsByPhaseId);

module.exports = router;
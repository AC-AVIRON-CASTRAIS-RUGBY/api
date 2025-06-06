const express = require('express');
const router = express.Router();
const phaseController = require('../controllers/phaseController');

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
 *     responses:
 *       200:
 *         description: Liste des phases récupérée avec succès
 *   post:
 *     summary: Crée une nouvelle phase
 *     tags: [Phases]
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
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Phase créée avec succès
 */
router.get('/tournaments/:tournamentId', phaseController.getPhasesByTournamentId);
router.post('/tournaments/:tournamentId', phaseController.createPhase);

/**
 * @swagger
 * /phases/{id}:
 *   get:
 *     summary: Récupère une phase par ID
 *     tags: [Phases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Phase récupérée avec succès
 *   put:
 *     summary: Met à jour une phase
 *     tags: [Phases]
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
 *             $ref: '#/components/schemas/Phase'
 *     responses:
 *       200:
 *         description: Phase mise à jour avec succès
 *   delete:
 *     summary: Supprime une phase
 *     tags: [Phases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Phase supprimée avec succès
 */
router.get('/:id', phaseController.getPhaseById);
router.put('/:id', phaseController.updatePhase);
router.delete('/:id', phaseController.deletePhase);

/**
 * @swagger
 * /phases/{id}/pools:
 *   get:
 *     summary: Récupère toutes les poules d'une phase
 *     tags: [Phases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Poules de la phase récupérées avec succès
 */
router.get('/:id/pools', phaseController.getPoolsByPhaseId);

module.exports = router;
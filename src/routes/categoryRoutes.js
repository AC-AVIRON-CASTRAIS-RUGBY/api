const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/**
 * @swagger
 * /api/categories/tournaments/{tournamentId}:
 *   get:
 *     summary: Récupère toutes les catégories d'un tournoi
 *     tags: [Catégories]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du tournoi
 *     responses:
 *       200:
 *         description: Catégories récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Category_Id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   age_min:
 *                     type: integer
 *                   age_max:
 *                     type: integer
 *                   description:
 *                     type: string
 *                   Tournament_Id:
 *                     type: integer
 *       500:
 *         description: Erreur serveur
 */
router.get('/tournaments/:tournamentId', categoryController.getAllCategoriesByTournament);

/**
 * @swagger
 * /categories/tournaments/{tournamentId}:
 *   post:
 *     summary: Crée une nouvelle catégorie
 *     tags: [Catégories]
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
 *               age_min:
 *                 type: integer
 *               age_max:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Catégorie créée avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/tournaments/:tournamentId', categoryController.createCategory);

/**
 * @swagger
 * /categories/tournaments/{tournamentId}/{id}:
 *   get:
 *     summary: Récupère une catégorie par son ID
 *     tags: [Catégories]
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
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Catégorie récupérée avec succès
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/tournaments/:tournamentId/:id', categoryController.getCategoryById);

/**
 * @swagger
 * /categories/tournaments/{tournamentId}/{id}:
 *   put:
 *     summary: Met à jour une catégorie
 *     tags: [Catégories]
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
 *         description: ID de la catégorie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age_min:
 *                 type: integer
 *               age_max:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Catégorie mise à jour avec succès
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put('/tournaments/:tournamentId/:id', categoryController.updateCategory);

/**
 * @swagger
 * /api/categories/tournaments/{tournamentId}/{id}:
 *   delete:
 *     summary: Supprime une catégorie
 *     tags: [Catégories]
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
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Catégorie supprimée avec succès
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/tournaments/:tournamentId/:id', categoryController.deleteCategory);

/**
 * @swagger
 * /api/categories/tournaments/{tournamentId}/{id}/pools:
 *   get:
 *     summary: Récupère toutes les poules d'une catégorie
 *     tags: [Catégories]
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
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Poules récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Pool_Id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   Phase_Id:
 *                     type: integer
 *                   Category_Id:
 *                     type: integer
 *                   phase_name:
 *                     type: string
 *       500:
 *         description: Erreur serveur
 */
router.get('/tournaments/:tournamentId/:id/pools', categoryController.getPoolsByCategory);

module.exports = router;

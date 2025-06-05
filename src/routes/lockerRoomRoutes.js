const express = require('express');
const router = express.Router();
const lockerRoomController = require('../controllers/lockerRoomController');

/**
 * @swagger
 * /api/locker-rooms:
 *   get:
 *     summary: Récupère tous les vestiaires
 *     tags: [Vestiaires]
 *     responses:
 *       200:
 *         description: Vestiaires récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LockerRoom'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', lockerRoomController.getAllLockerRooms);

/**
 * @swagger
 * /api/locker-rooms:
 *   post:
 *     summary: Crée un nouveau vestiaire
 *     tags: [Vestiaires]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - Team_Id
 *             properties:
 *               number:
 *                 type: integer
 *               Team_Id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Vestiaire créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/', lockerRoomController.createLockerRoom);

/**
 * @swagger
 * /locker-rooms/{id}:
 *   get:
 *     summary: Récupère un vestiaire par son ID
 *     tags: [Vestiaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du vestiaire
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
router.get('/:id', lockerRoomController.getLockerRoomById);

/**
 * @swagger
 * /locker-rooms/{id}:
 *   put:
 *     summary: Met à jour un vestiaire
 *     tags: [Vestiaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du vestiaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               number:
 *                 type: integer
 *               Team_Id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Vestiaire mis à jour avec succès
 *       404:
 *         description: Vestiaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', lockerRoomController.updateLockerRoom);

/**
 * @swagger
 * /api/locker-rooms/{id}:
 *   delete:
 *     summary: Supprime un vestiaire
 *     tags: [Vestiaires]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du vestiaire
 *     responses:
 *       200:
 *         description: Vestiaire supprimé avec succès
 *       404:
 *         description: Vestiaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', lockerRoomController.deleteLockerRoom);

/**
 * @swagger
 * /api/locker-rooms/team/{teamId}:
 *   get:
 *     summary: Récupère le vestiaire d'une équipe
 *     tags: [Vestiaires]
 *     parameters:
 *       - in: path
 *         name: teamId
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
router.get('/team/:teamId', lockerRoomController.getLockerRoomByTeamId);

module.exports = router;
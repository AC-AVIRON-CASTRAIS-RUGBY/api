const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const refereeController = require('../controllers/refereeController');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/referee-login:
 *   post:
 *     summary: Connexion spécifique pour les arbitres
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loginUUID
 *               - password
 *             properties:
 *               loginUUID:
 *                 type: string
 *                 description: UUID de connexion de l'arbitre
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mot de passe de l'arbitre
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 refereeId:
 *                   type: integer
 *                   description: ID de l'arbitre
 *                 refereeName:
 *                   type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Paramètres manquants
 *       401:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/referee-login', authController.refereeLogin);

/**
 * @swagger
 * /auth/verify/{uuid}:
 *   get:
 *     summary: Vérification d'un token d'authentification
 *     tags: [Authentification]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID de vérification
 *     responses:
 *       200:
 *         description: Token valide
 *       401:
 *         description: Token invalide
 *       500:
 *         description: Erreur serveur
 */
router.get('/verify/:uuid', authController.verifyAuth);

/**
 * @swagger
 * /auth/update-password:
 *   post:
 *     summary: Mise à jour du mot de passe
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uuid
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               uuid:
 *                 type: string
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Mot de passe actuel incorrect
 *       500:
 *         description: Erreur serveur
 */
router.post('/update-password', authController.updatePassword);

module.exports = router;
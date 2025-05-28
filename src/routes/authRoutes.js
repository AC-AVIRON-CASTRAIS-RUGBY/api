const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * paths:
 *   /api/auth/login:
 *     post:
 *       summary: Connexion d'un utilisateur
 *       tags: [Authentification]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - email
 *                 - password
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                 password:
 *                   type: string
 *                   format: password
 *       responses:
 *         200:
 *           description: Connexion réussie
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   token:
 *                     type: string
 *                   user:
 *                     type: object
 *         401:
 *           description: Identifiants invalides
 *         500:
 *           description: Erreur serveur
 */
router.post('/login', authController.login);

/**
 * @swagger
 * paths:
 *   /api/auth/verify/{uuid}:
 *     get:
 *       summary: Vérification d'un token d'authentification
 *       tags: [Authentification]
 *       parameters:
 *         - in: path
 *           name: uuid
 *           required: true
 *           schema:
 *             type: string
 *           description: UUID de vérification
 *       responses:
 *         200:
 *           description: Token valide
 *         401:
 *           description: Token invalide
 *         500:
 *           description: Erreur serveur
 */
router.get('/verify/:uuid', authController.verifyAuth);

/**
 * @swagger
 * paths:
 *   /api/auth/update-password:
 *     post:
 *       summary: Mise à jour du mot de passe
 *       tags: [Authentification]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - userId
 *                 - currentPassword
 *                 - newPassword
 *               properties:
 *                 userId:
 *                   type: integer
 *                 currentPassword:
 *                   type: string
 *                 newPassword:
 *                   type: string
 *       responses:
 *         200:
 *           description: Mot de passe mis à jour avec succès
 *         400:
 *           description: Données invalides
 *         401:
 *           description: Mot de passe actuel incorrect
 *         500:
 *           description: Erreur serveur
 */
router.post('/update-password', authController.updatePassword);

/**
 * @swagger
 * paths:
 *   /api/auth/referees/{refereeId}/account:
 *     post:
 *       summary: Création d'un compte pour un arbitre
 *       tags: [Authentification]
 *       parameters:
 *         - in: path
 *           name: refereeId
 *           required: true
 *           schema:
 *             type: integer
 *           description: ID de l'arbitre
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - email
 *                 - password
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                 password:
 *                   type: string
 *                   format: password
 *       responses:
 *         201:
 *           description: Compte créé avec succès
 *         400:
 *           description: Données invalides ou arbitre déjà associé à un compte
 *         404:
 *           description: Arbitre non trouvé
 *         500:
 *           description: Erreur serveur
 */
router.post('/referees/:refereeId/account', authController.createRefereeAccount);

module.exports = router;
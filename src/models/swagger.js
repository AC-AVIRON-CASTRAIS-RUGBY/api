/**
 * @swagger
 * components:
 *   schemas:
 *     Tournament:
 *       type: object
 *       required:
 *         - name
 *         - start_date
 *         - location
 *         - account_id
 *       properties:
 *         Tournament_Id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         start_date:
 *           type: string
 *           format: date-time
 *         location:
 *           type: string
 *         break_time:
 *           type: integer
 *           default: 5
 *         points_win:
 *           type: integer
 *           default: 3
 *         points_draw:
 *           type: integer
 *           default: 1
 *         points_loss:
 *           type: integer
 *           default: 0
 *         account_id:
 *           type: integer
 *           description: ID du compte administrateur responsable du tournoi
 *
 *     Team:
 *       type: object
 *       properties:
 *         Team_Id:
 *           type: integer
 *         name:
 *           type: string
 *         logo:
 *           type: string
 *         age_category:
 *           type: string
 *         paid:
 *           type: boolean
 *         Tournament_Id:
 *           type: integer
 *         Pool_Id:
 *           type: integer
 *
 *     Game:
 *       type: object
 *       properties:
 *         Game_Id:
 *           type: integer
 *         start_time:
 *           type: string
 *           format: date-time
 *         Team1_Id:
 *           type: integer
 *         Team2_Id:
 *           type: integer
 *         Team1_Score:
 *           type: integer
 *         Team2_Score:
 *           type: integer
 *         is_completed:
 *           type: boolean
 *         Referee_Id:
 *           type: integer
 *         Pool_Id:
 *           type: integer
 *         Tournament_Id:
 *           type: integer
 *
 *     Referee:
 *       type: object
 *       properties:
 *         Referee_Id:
 *           type: integer
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         loginUUID:
 *           type: string
 *         password:
 *           type: string
 *         Tournament_Id:
 *           type: integer
 *
 *     Pool:
 *       type: object
 *       properties:
 *         Pool_Id:
 *           type: integer
 *         name:
 *           type: string
 *         Phase_Id:
 *           type: integer
 *         Category_Id:
 *           type: integer
 *
 *     Phase:
 *       type: object
 *       properties:
 *         Phase_Id:
 *           type: integer
 *         name:
 *           type: string
 *         Tournament_Id:
 *           type: integer
 *
 *     LockerRoom:
 *       type: object
 *       properties:
 *         LockerRoom_Id:
 *           type: integer
 *         number:
 *           type: integer
 *         Team_Id:
 *           type: integer
 *
 *     Player:
 *       type: object
 *       properties:
 *         Player_Id:
 *           type: integer
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         number:
 *           type: integer
 *         position:
 *           type: string
 *         present:
 *           type: boolean
 *         Team_Id:
 *           type: integer
 *
 *     Category:
 *       type: object
 *       properties:
 *         Category_Id:
 *           type: integer
 *         name:
 *           type: string
 *         age_min:
 *           type: integer
 *         age_max:
 *           type: integer
 *         description:
 *           type: string
 *         game_duration:
 *           type: integer
 *         Tournament_Id:
 *           type: integer
 */

/**
 * @swagger
 * tags:
 *   - name: Tournois
 *     description: Gestion des tournois
 *   - name: Équipes
 *     description: Gestion des équipes
 *   - name: Matchs
 *     description: Gestion des matchs
 *   - name: Poules
 *     description: Gestion des poules
 *   - name: Phases
 *     description: Gestion des phases
 *   - name: Arbitres
 *     description: Gestion des arbitres
 *   - name: Vestiaires
 *     description: Gestion des vestiaires
 *   - name: Joueurs
 *     description: Gestion des joueurs
 *   - name: Calendrier
 *     description: Gestion du calendrier
 *   - name: Authentification
 *     description: Authentification
 *   - name: Catégories
 *     description: Gestion des catégories
 *   - name: Upload
 *     description: Upload de fichiers
 */

/**
 * @swagger
 * /tournaments:
 *   get:
 *     summary: Récupère tous les tournois
 *     tags: [Tournois]
 *     responses:
 *       200:
 *         description: Liste des tournois
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tournament'
 *   post:
 *     summary: Crée un nouveau tournoi
 *     tags: [Tournois]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tournament'
 *     responses:
 *       201:
 *         description: Tournoi créé avec succès
 *
 * /tournaments/{id}:
 *   get:
 *     summary: Récupère un tournoi par ID
 *     tags: [Tournois]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tournoi trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tournament'
 *   put:
 *     summary: Met à jour un tournoi
 *     tags: [Tournois]
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom du tournoi
 *               description:
 *                 type: string
 *                 description: Description du tournoi
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 description: Date de début du tournoi
 *               location:
 *                 type: string
 *                 description: Lieu du tournoi
 *               break_time:
 *                 type: integer
 *                 description: Temps de pause en minutes
 *                 default: 5
 *               points_win:
 *                 type: integer
 *                 description: Points pour une victoire
 *                 default: 3
 *               points_draw:
 *                 type: integer
 *                 description: Points pour un match nul
 *                 default: 1
 *               points_loss:
 *                 type: integer
 *                 description: Points pour une défaite
 *                 default: 0
 *               account_id:
 *                 type: integer
 *                 description: ID du compte administrateur
 *               image:
 *                 type: string
 *                 description: URL de l'image du tournoi
 *     responses:
 *       200:
 *         description: Tournoi mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tournoi mis à jour avec succès"
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Compte non trouvé"
 *       404:
 *         description: Tournoi non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tournoi non trouvé"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *
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
 *     responses:
 *       200:
 *         description: Liste des équipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Team'
 *   post:
 *     summary: Crée une nouvelle équipe
 *     tags: [Équipes]
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
 *             $ref: '#/components/schemas/Team'
 *     responses:
 *       201:
 *         description: Équipe créée
 *
 * /teams/tournaments/{tournamentId}/{id}:
 *   get:
 *     summary: Récupère une équipe par ID
 *     tags: [Équipes]
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
 *         description: Équipe trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
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
 *                 description: Nom de l'équipe
 *               logo:
 *                 type: string
 *                 description: URL du logo de l'équipe
 *               Category_Id:
 *                 type: integer
 *                 description: ID de la catégorie
 *               paid:
 *                 type: boolean
 *                 description: Statut de paiement
 *     responses:
 *       200:
 *         description: Équipe mise à jour avec succès
 *       404:
 *         description: Équipe non trouvée
 *       500:
 *         description: Erreur serveur
 *
 * /games:
 *   get:
 *     summary: Récupère tous les matchs
 *     tags: [Matchs]
 *     responses:
 *       200:
 *         description: Liste des matchs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *   post:
 *     summary: Crée un nouveau match
 *     tags: [Matchs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       201:
 *         description: Match créé
 *
 * /games/{id}:
 *   get:
 *     summary: Récupère un match par ID
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Match trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *   put:
 *     summary: Met à jour un match
 *     tags: [Matchs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du match
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 description: Heure de début du match
 *               Team1_Id:
 *                 type: integer
 *                 description: ID de l'équipe 1
 *               Team2_Id:
 *                 type: integer
 *                 description: ID de l'équipe 2
 *               Team1_Score:
 *                 type: integer
 *                 description: Score de l'équipe 1
 *               Team2_Score:
 *                 type: integer
 *                 description: Score de l'équipe 2
 *               is_completed:
 *                 type: boolean
 *                 description: Match terminé ou non
 *               Referee_Id:
 *                 type: integer
 *                 description: ID de l'arbitre
 *               Pool_Id:
 *                 type: integer
 *                 description: ID de la poule
 *               Field_Id:
 *                 type: integer
 *                 description: ID du terrain
 *     responses:
 *       200:
 *         description: Match mis à jour avec succès
 *       404:
 *         description: Match non trouvé
 *       500:
 *         description: Erreur serveur
 *
 * /referees:
 *   get:
 *     summary: Récupère tous les arbitres
 *     tags: [Arbitres]
 *     responses:
 *       200:
 *         description: Liste des arbitres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Referee'
 *   post:
 *     summary: Crée un nouvel arbitre
 *     tags: [Arbitres]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Referee'
 *     responses:
 *       201:
 *         description: Arbitre créé
 *
 * /referees/{id}:
 *   get:
 *     summary: Récupère un arbitre par ID
 *     tags: [Arbitres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Arbitre trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Referee'
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
 *                 description: Nom de famille de l'arbitre
 *               first_name:
 *                 type: string
 *                 description: Prénom de l'arbitre
 *               loginUUID:
 *                 type: string
 *                 description: UUID de connexion
 *               Tournament_Id:
 *                 type: integer
 *                 description: ID du tournoi associé
 *     responses:
 *       200:
 *         description: Arbitre mis à jour avec succès
 *       404:
 *         description: Arbitre non trouvé
 *       500:
 *         description: Erreur serveur
 *
 * /auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *
 * /auth/referee-login:
 *   post:
 *     summary: Connexion arbitre
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loginUUID:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 */
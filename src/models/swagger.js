/**
 * @swagger
 * components:
 *   schemas:
 *     Tournament:
 *       type: object
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
 *         game_duration:
 *           type: integer
 *         break_time:
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
 *         Field_Id:
 *           type: integer
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [admin, referee, user]
 *         referee_id:
 *           type: integer
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
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
 *     Phase:
 *       type: object
 *       properties:
 *         Phase_Id:
 *           type: integer
 *         name:
 *           type: string
 *         type:
 *           type: string
 *           enum: [group, elimination, ranking]
 *         start_date:
 *           type: string
 *           format: date-time
 *         end_date:
 *           type: string
 *           format: date-time
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
 *         Tournament_Id:
 *           type: integer
 *         Pool_Id:
 *           type: integer
 *           nullable: true
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
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         level:
 *           type: string
 *         Tournament_Id:
 *           type: integer
 *         password:
 *           type: string
 *           nullable: true
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
 *         Team_Id:
 *           type: integer
 *       required:
 *         - first_name
 *         - last_name
 *
 *     Field:
 *       type: object
 *       properties:
 *         Field_Id:
 *           type: integer
 *         name:
 *           type: string
 *         location:
 *           type: string
 *         available:
 *           type: boolean
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
 *     description: Gestion du calendrier des matchs
 *   - name: Authentification
 *     description: Authentification et gestion des comptes
 *   - name: Catégories
 *     description: Gestion des catégories d'âge
 */
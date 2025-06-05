const db = require('../config/db');

exports.generateSchedule = async (req, res) => {
    const { tournamentId } = req.params;

    try {
        // Récupérer les informations du tournoi
        const [tournaments] = await db.query(
            'SELECT * FROM Tournament WHERE Tournament_Id = ?',
            [tournamentId]
        );

        if (tournaments.length === 0) {
            return res.status(404).json({ message: "Tournoi non trouvé" });
        }

        const tournament = tournaments[0];
        const breakTime = tournament.break_time || 5;
        const startDate = new Date(tournament.start_date);

        // Récupérer tous les matchs du tournoi avec leurs catégories
        const [games] = await db.query(
            `SELECT g.*, p.Category_Id, c.game_duration 
             FROM Game g 
             JOIN Pool p ON g.Pool_Id = p.Pool_Id 
             JOIN Category c ON p.Category_Id = c.Category_Id 
             WHERE g.Tournament_Id = ? 
             ORDER BY c.Category_Id, p.Pool_Id, g.Game_Id`,
            [tournamentId]
        );

        // Calculer les horaires
        let currentTime = new Date(startDate);

        for (const game of games) {
            const gameDuration = game.game_duration || 10;

            // Mettre à jour l'heure de début
            await db.query(
                'UPDATE Game SET start_time = ? WHERE Game_Id = ?',
                [currentTime, game.Game_Id]
            );

            // Ajouter la durée du match + pause
            currentTime = new Date(currentTime.getTime() + (gameDuration + breakTime) * 60000);
        }

        res.status(200).json({
            message: "Calendrier des matchs généré avec succès",
            gamesUpdated: games.length
        });
    } catch (error) {
        console.error('Erreur lors de la génération du calendrier:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la génération du calendrier",
            error: error.message
        });
    }
};

exports.getTournamentSchedule = async (req, res) => {
    const { tournamentId } = req.params;

    try {
        // Récupérer les informations du tournoi
        const [tournaments] = await db.query(
            'SELECT * FROM Tournament WHERE Tournament_Id = ?',
            [tournamentId]
        );

        if (tournaments.length === 0) {
            return res.status(404).json({ message: "Tournoi non trouvé" });
        }

        // Récupérer tous les matchs du tournoi avec les informations des équipes et des poules
        const [games] = await db.query(
            `SELECT g.*, 
                    t1.name AS team1_name, 
                    t2.name AS team2_name,
                    p.name AS pool_name,
                    r.last_name AS referee_name,
                    f.name AS field_name
             FROM Game g 
             JOIN Team t1 ON g.Team1_Id = t1.Team_Id
             JOIN Team t2 ON g.Team2_Id = t2.Team_Id
             JOIN Pool p ON g.Pool_Id = p.Pool_Id
             JOIN Referee r ON g.Referee_Id = r.Referee_Id
             LEFT JOIN Field f ON g.Field_Id = f.Field_Id
             WHERE g.Tournament_Id = ?
             ORDER BY g.start_time, p.name`,
            [tournamentId]
        );

        // Organiser les matchs par poule
        const scheduleByPool = {};
        games.forEach(game => {
            if (!scheduleByPool[game.pool_name]) {
                scheduleByPool[game.pool_name] = [];
            }

            scheduleByPool[game.pool_name].push({
                gameId: game.Game_Id,
                startTime: game.start_time,
                team1: {
                    id: game.Team1_Id,
                    name: game.team1_name,
                    score: game.Team1_Score
                },
                team2: {
                    id: game.Team2_Id,
                    name: game.team2_name,
                    score: game.Team2_Score
                },
                referee: game.referee_name,
                field: game.field_name,
                isCompleted: game.is_completed === 1
            });
        });

        res.status(200).json({
            tournamentId,
            tournamentName: tournaments[0].name,
            schedule: scheduleByPool
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du calendrier:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération du calendrier",
            error: error.message
        });
    }
};
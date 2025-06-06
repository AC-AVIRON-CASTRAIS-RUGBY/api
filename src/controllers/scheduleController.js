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
        const breakTime = tournament.break_time || 5; // Temps de pause en minutes
        const startDate = new Date(tournament.start_date);

        // Vérifier s'il y a déjà des matchs
        const [existingGames] = await db.query(
            `SELECT g.* FROM Game g 
             JOIN Pool p ON g.Pool_Id = p.Pool_Id 
             JOIN Phase ph ON p.Phase_Id = ph.Phase_Id
             WHERE ph.Tournament_Id = ?`,
            [tournamentId]
        );

        let totalGamesCreated = 0;

        // Si aucun match n'existe, les générer automatiquement
        if (existingGames.length === 0) {
            console.log('Aucun match trouvé, génération automatique...');

            // Récupérer toutes les poules du tournoi avec leurs équipes
            const [pools] = await db.query(
                `SELECT p.*, ph.name as phase_name, c.name as category_name
                 FROM Pool p 
                 JOIN Phase ph ON p.Phase_Id = ph.Phase_Id 
                 LEFT JOIN Category c ON p.Category_Id = c.Category_Id
                 WHERE ph.Tournament_Id = ?
                 ORDER BY ph.Phase_Id, p.Pool_Id`,
                [tournamentId]
            );

            if (pools.length === 0) {
                return res.status(404).json({ message: "Aucune poule trouvée pour ce tournoi" });
            }

            // Récupérer un arbitre par défaut pour le tournoi
            const [referees] = await db.query(
                'SELECT * FROM Referee WHERE Tournament_Id = ? LIMIT 1',
                [tournamentId]
            );

            if (referees.length === 0) {
                return res.status(400).json({ message: "Aucun arbitre disponible pour générer les matchs" });
            }

            const defaultRefereeId = referees[0].Referee_Id;

            // Générer les matchs pour chaque poule
            for (const pool of pools) {
                console.log(`Génération des matchs pour la poule: ${pool.name}`);

                // Récupérer les équipes de cette poule
                const [teams] = await db.query(
                    `SELECT t.* FROM Team t 
                     JOIN PoolTeam pt ON t.Team_Id = pt.Team_Id 
                     WHERE pt.Pool_Id = ? AND t.Tournament_Id = ?`,
                    [pool.Pool_Id, tournamentId]
                );

                if (teams.length < 2) {
                    console.log(`Poule ${pool.name} ignorée: seulement ${teams.length} équipe(s)`);
                    continue;
                }

                // Générer tous les matchs possibles (chaque équipe contre chaque autre)
                let poolGamesCreated = 0;
                for (let i = 0; i < teams.length; i++) {
                    for (let j = i + 1; j < teams.length; j++) {
                        await db.query(
                            'INSERT INTO Game (Team1_Id, Team2_Id, Pool_Id, Referee_Id, Tournament_Id, Team1_Score, Team2_Score, is_completed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                            [teams[i].Team_Id, teams[j].Team_Id, pool.Pool_Id, defaultRefereeId, tournamentId, 0, 0, false]
                        );
                        poolGamesCreated++;
                        totalGamesCreated++;
                    }
                }

                console.log(`${poolGamesCreated} matchs créés pour la poule ${pool.name}`);
            }

            console.log(`Total: ${totalGamesCreated} matchs générés automatiquement`);
        }

        // Maintenant récupérer tous les matchs (existants + nouvellement créés) avec leurs catégories et durées
        const [games] = await db.query(
            `SELECT g.*, 
                    p.Category_Id, 
                    c.game_duration,
                    c.name as category_name,
                    p.name as pool_name,
                    ph.name as phase_name
             FROM Game g 
             JOIN Pool p ON g.Pool_Id = p.Pool_Id 
             JOIN Phase ph ON p.Phase_Id = ph.Phase_Id
             LEFT JOIN Category c ON p.Category_Id = c.Category_Id 
             WHERE ph.Tournament_Id = ? 
             ORDER BY ph.Phase_Id, c.Category_Id, p.Pool_Id, g.Game_Id`,
            [tournamentId]
        );

        if (games.length === 0) {
            return res.status(404).json({ message: "Aucun match trouvé après génération automatique" });
        }

        console.log(`Planification du calendrier pour ${games.length} matchs`);

        // Calculer les horaires
        let currentTime = new Date(startDate);
        let scheduledGames = 0;

        for (const game of games) {
            // Utiliser la durée spécifique de la catégorie, ou 10 minutes par défaut
            const gameDuration = game.game_duration || 10;
            
            console.log(`Match ${game.Game_Id} - Catégorie: ${game.category_name || 'Aucune'}, Durée: ${gameDuration}min, Heure: ${currentTime.toLocaleTimeString()}`);

            // Mettre à jour l'heure de début du match
            await db.query(
                'UPDATE Game SET start_time = ? WHERE Game_Id = ?',
                [currentTime, game.Game_Id]
            );

            scheduledGames++;

            // Calculer l'heure de fin du match actuel + temps de pause
            // Ajouter la durée du match + temps de pause pour le match suivant
            currentTime = new Date(currentTime.getTime() + (gameDuration + breakTime) * 60000);
        }

        // Calculer l'heure de fin prévue du tournoi
        const endTime = new Date(currentTime.getTime() - breakTime * 60000); // Retirer la dernière pause

        res.status(200).json({
            message: "Calendrier des matchs généré avec succès",
            tournamentId: parseInt(tournamentId),
            startTime: startDate.toISOString(),
            endTime: endTime.toISOString(),
            gamesGenerated: totalGamesCreated,
            gamesScheduled: scheduledGames,
            totalDuration: Math.round((endTime - startDate) / (1000 * 60)), // Durée totale en minutes
            breakTimeBetweenGames: breakTime,
            schedule: {
                start: startDate.toLocaleString('fr-FR'),
                end: endTime.toLocaleString('fr-FR'),
                duration: `${Math.floor((endTime - startDate) / (1000 * 60 * 60))}h ${Math.round(((endTime - startDate) / (1000 * 60)) % 60)}min`
            }
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
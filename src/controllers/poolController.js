const db = require('../config/db');

// Fonction utilitaire pour le débogage
const logStandingsCalculation = (enabled, message) => {
    if (enabled) {
        console.log(`[Standings Debug] ${message}`);
    }
};

// Constante pour activer/désactiver les logs
const DEBUG_STANDINGS = true;

exports.getAllPoolsByTournament = async (req, res) => {
    const { tournamentId } = req.params;

    try {
        const [rows] = await db.query(
            'SELECT p.*, c.name as category_name FROM Pool p ' +
            'JOIN Phase ph ON p.Phase_Id = ph.Phase_Id ' +
            'LEFT JOIN Category c ON p.Category_Id = c.Category_Id ' +
            'WHERE ph.Tournament_Id = ?',
            [tournamentId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des poules:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des poules",
            error: error.message
        });
    }
};

exports.getPoolById = async (req, res) => {
    const { id, tournamentId } = req.params;

    try {
        const [rows] = await db.query(
            'SELECT p.*, c.name as category_name FROM Pool p ' +
            'JOIN Phase ph ON p.Phase_Id = ph.Phase_Id ' +
            'LEFT JOIN Category c ON p.Category_Id = c.Category_Id ' +
            'WHERE p.Pool_Id = ? AND ph.Tournament_Id = ?',
            [id, tournamentId]
        );

        if (rows.length === 0) {
            return res.status(503).json({ message: "Poule non trouvée" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération de la poule:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération de la poule",
            error: error.message
        });
    }
}

exports.getTeamsByPoolId = async (req, res) => {
    const { id, tournamentId } = req.params;

    try {
        const [rows] = await db.query(
            'SELECT t.* FROM Team t JOIN PoolTeam pt ON t.Team_Id = pt.Team_Id ' +
            'JOIN Pool p ON pt.Pool_Id = p.Pool_Id JOIN Phase ph ON p.Phase_Id = ph.Phase_Id ' +
            'WHERE pt.Pool_Id = ? AND ph.Tournament_Id = ?',
            [id, tournamentId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des équipes de la poule:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des équipes",
            error: error.message
        });
    }
};

exports.createPool = async (req, res) => {
    const { name, Phase_Id, Category_Id } = req.body;
    const { tournamentId } = req.params;

    if (!name || !Phase_Id) {
        return res.status(400).json({ message: "Le nom et l'ID de phase sont requis" });
    }

    try {
        // Vérifier que la phase appartient au tournoi spécifié
        const [phases] = await db.query(
            'SELECT * FROM Phase WHERE Phase_Id = ? AND Tournament_Id = ?',
            [Phase_Id, tournamentId]
        );

        if (phases.length === 0) {
            return res.status(400).json({ message: "Phase invalide pour ce tournoi" });
        }

        // Vérifier que la catégorie appartient au tournoi spécifié (si fournie)
        if (Category_Id) {
            const [categories] = await db.query(
                'SELECT * FROM Category WHERE Category_Id = ? AND Tournament_Id = ?',
                [Category_Id, tournamentId]
            );

            if (categories.length === 0) {
                return res.status(400).json({ message: "Catégorie invalide pour ce tournoi" });
            }
        }

        const [result] = await db.query(
            'INSERT INTO Pool (name, Phase_Id, Category_Id) VALUES (?, ?, ?)',
            [name, Phase_Id, Category_Id]
        );

        res.status(201).json({
            message: "Poule créée avec succès",
            poolId: result.insertId
        });
    } catch (error) {
        console.error('Erreur lors de la création de la poule:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la création de la poule",
            error: error.message
        });
    }
};

exports.updatePool = async (req, res) => {
    const { name, Phase_Id, Category_Id } = req.body;
    const { id, tournamentId } = req.params;

    try {
        // Vérifier que la poule appartient au tournoi spécifié
        const [pools] = await db.query(
            'SELECT p.* FROM Pool p JOIN Phase ph ON p.Phase_Id = ph.Phase_Id WHERE p.Pool_Id = ? AND ph.Tournament_Id = ?',
            [id, tournamentId]
        );

        if (pools.length === 0) {
            return res.status(503).json({ message: "Poule non trouvée dans ce tournoi" });
        }

        // Vérifier que la nouvelle phase appartient au tournoi spécifié
        if (Phase_Id) {
            const [phases] = await db.query(
                'SELECT * FROM Phase WHERE Phase_Id = ? AND Tournament_Id = ?',
                [Phase_Id, tournamentId]
            );

            if (phases.length === 0) {
                return res.status(400).json({ message: "Phase invalide pour ce tournoi" });
            }
        }

        // Vérifier que la nouvelle catégorie appartient au tournoi spécifié
        if (Category_Id) {
            const [categories] = await db.query(
                'SELECT * FROM Category WHERE Category_Id = ? AND Tournament_Id = ?',
                [Category_Id, tournamentId]
            );

            if (categories.length === 0) {
                return res.status(400).json({ message: "Catégorie invalide pour ce tournoi" });
            }
        }

        const [result] = await db.query(
            'UPDATE Pool SET name = ?, Phase_Id = ?, Category_Id = ? WHERE Pool_Id = ?',
            [name, Phase_Id, Category_Id, id]
        );

        res.status(200).json({ message: "Poule mise à jour avec succès" });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la poule:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la mise à jour de la poule",
            error: error.message
        });
    }
};

exports.deletePool = async (req, res) => {
    const { id, tournamentId } = req.params;

    try {
        // Vérifier que la poule appartient au tournoi spécifié
        const [pools] = await db.query(
            'SELECT p.* FROM Pool p JOIN Phase ph ON p.Phase_Id = ph.Phase_Id WHERE p.Pool_Id = ? AND ph.Tournament_Id = ?',
            [id, tournamentId]
        );

        if (pools.length === 0) {
            return res.status(503).json({ message: "Poule non trouvée dans ce tournoi" });
        }

        const [result] = await db.query('DELETE FROM Pool WHERE Pool_Id = ?', [id]);
        res.status(200).json({ message: "Poule supprimée avec succès" });
    } catch (error) {
        console.error('Erreur lors de la suppression de la poule:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la suppression de la poule",
            error: error.message
        });
    }
};

exports.getPoolStandings = async (req, res) => {
    const { id, tournamentId } = req.params;

    try {
        // Vérifier que la poule appartient au tournoi spécifié
        const [poolCheck] = await db.query(
            'SELECT p.* FROM Pool p JOIN Phase ph ON p.Phase_Id = ph.Phase_Id WHERE p.Pool_Id = ? AND ph.Tournament_Id = ?',
            [id, tournamentId]
        );

        if (poolCheck.length === 0) {
            return res.status(503).json({ message: "Poule non trouvée dans ce tournoi" });
        }

        // Récupérer toutes les équipes de la poule
        const [teams] = await db.query(
            'SELECT t.* FROM Team t JOIN PoolTeam pt ON t.Team_Id = pt.Team_Id WHERE pt.Pool_Id = ? AND t.Tournament_Id = ?',
            [id, tournamentId]
        );

        if (teams.length === 0) {
            return res.status(503).json({ message: "Aucune équipe trouvée dans cette poule" });
        }

        // Récupérer tous les matchs de la poule pour ce tournoi
        const [games] = await db.query(
            'SELECT * FROM Game WHERE Pool_Id = ? AND Tournament_Id = ?',
            [id, tournamentId]
        );

        logStandingsCalculation(DEBUG_STANDINGS, `Poule ${id}, Tournoi ${tournamentId} - Équipes trouvées: ${teams.length}, Matchs trouvés: ${games.length}`);

        // Regrouper les équipes par nom de club (ignorer la catégorie d'âge)
        const clubsMap = new Map();
        teams.forEach(team => {
            // Extrait le nom du club (sans la catégorie d'âge)
            // Par exemple: "FC Barcelona U10" => "FC Barcelona"
            const clubName = team.name.replace(/\s+U\d+$/, '').trim();
            
            if (!clubsMap.has(clubName)) {
                clubsMap.set(clubName, {
                    name: clubName,
                    teamIds: [team.Team_Id], // Stocker tous les IDs d'équipes du même club
                    matchesPlayed: 0,
                    wins: 0,
                    losses: 0,
                    draws: 0,
                    points: 0,
                    // Conserver le logo de la première équipe du club
                    logo: team.logo
                });
                logStandingsCalculation(DEBUG_STANDINGS, `Nouveau club créé: ${clubName} avec équipe ${team.Team_Id}`);
            } else {
                // Ajouter cet ID d'équipe au club existant
                clubsMap.get(clubName).teamIds.push(team.Team_Id);
                logStandingsCalculation(DEBUG_STANDINGS, `Équipe ${team.Team_Id} ajoutée au club existant: ${clubName}`);
            }
        });

        // Calculer les statistiques pour chaque club
        games.forEach(game => {
            if (game.is_completed) {
                logStandingsCalculation(DEBUG_STANDINGS, `Match ${game.Game_Id}: Équipe ${game.Team1_Id} vs Équipe ${game.Team2_Id}, Score: ${game.Team1_Score}-${game.Team2_Score}`);
                
                // Trouver les clubs correspondant aux équipes du match
                let team1Club = null;
                let team2Club = null;

                // Rechercher le club contenant l'ID de l'équipe 1 et 2
                for (const [name, club] of clubsMap.entries()) {
                    if (club.teamIds.includes(game.Team1_Id)) {
                        team1Club = club;
                        logStandingsCalculation(DEBUG_STANDINGS, `Équipe 1 (ID: ${game.Team1_Id}) appartient au club: ${name}`);
                    }
                    if (club.teamIds.includes(game.Team2_Id)) {
                        team2Club = club;
                        logStandingsCalculation(DEBUG_STANDINGS, `Équipe 2 (ID: ${game.Team2_Id}) appartient au club: ${name}`);
                    }
                }

                // Si les deux équipes du match sont trouvées dans notre mapping
                if (team1Club && team2Club) {
                    // Incrémenter le nombre de matchs joués
                    team1Club.matchesPlayed++;
                    team2Club.matchesPlayed++;

                    // Déterminer le résultat
                    if (game.Team1_Score > game.Team2_Score) {
                        // L'équipe 1 gagne
                        team1Club.wins++;
                        team1Club.points += 3;
                        team2Club.losses++;
                        logStandingsCalculation(DEBUG_STANDINGS, `Club "${team1Club.name}" gagne`);
                    } else if (game.Team1_Score < game.Team2_Score) {
                        // L'équipe 2 gagne
                        team2Club.wins++;
                        team2Club.points += 3;
                        team1Club.losses++;
                        logStandingsCalculation(DEBUG_STANDINGS, `Club "${team2Club.name}" gagne`);
                    } else {
                        // Match nul
                        team1Club.draws++;
                        team2Club.draws++;
                        team1Club.points += 1;
                        team2Club.points += 1;
                        logStandingsCalculation(DEBUG_STANDINGS, `Match nul`);
                    }
                } else {
                    // Journaliser les clubs manquants
                    if (!team1Club) logStandingsCalculation(DEBUG_STANDINGS, `Club pour l'équipe 1 (ID: ${game.Team1_Id}) non trouvé`);
                    if (!team2Club) logStandingsCalculation(DEBUG_STANDINGS, `Club pour l'équipe 2 (ID: ${game.Team2_Id}) non trouvé`);
                }
            }
        });        // Convertir la Map en tableau et trier
        const clubStandings = Array.from(clubsMap.values());
        
        // Trier le classement par points (décroissant), puis par victoires, puis par différence de buts si implémentée
        clubStandings.sort((a, b) => {
            // D'abord par points
            if (b.points !== a.points) {
                return b.points - a.points;
            }
            // Ensuite par victoires
            if (b.wins !== a.wins) {
                return b.wins - a.wins;
            }
            // Ensuite par matchs joués (moins de matchs joués = meilleur classement à points égaux)
            return a.matchesPlayed - b.matchesPlayed;
        });

        // Ajouter le rang à chaque club
        const rankedStandings = clubStandings.map((club, index) => ({
            ...club,
            rank: index + 1,
            // Conserver les teamIds dans le résultat pour référence
            // mais les formater en string pour faciliter l'affichage
            teamIdsString: club.teamIds.join(','),
            teamIds: undefined
        }));

        res.status(200).json(rankedStandings);
    } catch (error) {
        console.error('Erreur lors de la récupération du classement de la poule:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération du classement",
            error: error.message
        });
    }
};

exports.getAllPoolsStandingsByTournament = async (req, res) => {
    const { tournamentId } = req.params;

    try {
        // Récupérer toutes les poules du tournoi
        const [pools] = await db.query(
            'SELECT p.Pool_Id, p.name as pool_name, c.name as category_name, ph.name as phase_name ' +
            'FROM Pool p ' +
            'JOIN Phase ph ON p.Phase_Id = ph.Phase_Id ' +
            'LEFT JOIN Category c ON p.Category_Id = c.Category_Id ' +
            'WHERE ph.Tournament_Id = ?',
            [tournamentId]
        );

        if (pools.length === 0) {
            return res.status(503).json({ message: "Aucune poule trouvée pour ce tournoi" });
        }

        // Récupérer les paramètres du tournoi pour le calcul des points
        const [tournamentSettings] = await db.query(
            'SELECT points_win, points_draw, points_loss FROM Tournament WHERE Tournament_Id = ?',
            [tournamentId]
        );

        if (tournamentSettings.length === 0) {
            return res.status(404).json({ message: "Tournoi non trouvé" });
        }

        const pointsForWin = tournamentSettings[0].points_win || 3;
        const pointsForDraw = tournamentSettings[0].points_draw || 1;
        const pointsForLoss = tournamentSettings[0].points_loss || 0;

        logStandingsCalculation(DEBUG_STANDINGS, `Paramètres du tournoi ${tournamentId}: Win=${pointsForWin}, Draw=${pointsForDraw}, Loss=${pointsForLoss}`);

        // Résultat final avec tous les classements
        const allPoolsStandings = [];

        // Pour chaque poule, calculer le classement
        for (const pool of pools) {
            // Récupérer toutes les équipes de la poule
            const [teams] = await db.query(
                'SELECT t.* FROM Team t JOIN PoolTeam pt ON t.Team_Id = pt.Team_Id WHERE pt.Pool_Id = ? AND t.Tournament_Id = ?',
                [pool.Pool_Id, tournamentId]
            );

            if (teams.length === 0) {
                // Ajouter une entrée pour la poule même si elle est vide
                allPoolsStandings.push({
                    poolId: pool.Pool_Id,
                    poolName: pool.pool_name,
                    categoryName: pool.category_name,
                    phaseName: pool.phase_name,
                    standings: []
                });
                continue;
            }

            // Récupérer tous les matchs de la poule pour ce tournoi
            const [games] = await db.query(
                'SELECT * FROM Game WHERE Pool_Id = ? AND Tournament_Id = ?',
                [pool.Pool_Id, tournamentId]
            );

            logStandingsCalculation(DEBUG_STANDINGS, `Poule ${pool.Pool_Id}, Tournoi ${tournamentId} - Équipes trouvées: ${teams.length}, Matchs trouvés: ${games.length}`);

            // Regrouper les équipes par nom de club (ignorer la catégorie d'âge)
            const clubsMap = new Map();
            teams.forEach(team => {
                // Extrait le nom du club (sans la catégorie d'âge)
                const clubName = team.name.replace(/\s+U\d+$/, '').trim();

                if (!clubsMap.has(clubName)) {
                    clubsMap.set(clubName, {
                        name: clubName,
                        teamIds: [team.Team_Id],
                        matchesPlayed: 0,
                        wins: 0,
                        losses: 0,
                        draws: 0,
                        points: 0,
                        goalsFor: 0,
                        goalsAgainst: 0,
                        logo: team.logo
                    });
                } else {
                    clubsMap.get(clubName).teamIds.push(team.Team_Id);
                }
            });

            // Calculer les statistiques pour chaque club
            games.forEach(game => {
                if (game.is_completed) {
                    // Trouver les clubs correspondant aux équipes du match
                    let team1Club = null;
                    let team2Club = null;

                    // Rechercher le club contenant l'ID de l'équipe 1 et 2
                    for (const [name, club] of clubsMap.entries()) {
                        if (club.teamIds.includes(game.Team1_Id)) {
                            team1Club = club;
                        }
                        if (club.teamIds.includes(game.Team2_Id)) {
                            team2Club = club;
                        }
                    }

                    // Si les deux équipes du match sont trouvées dans notre mapping
                    if (team1Club && team2Club) {
                        // Incrémenter le nombre de matchs joués
                        team1Club.matchesPlayed++;
                        team2Club.matchesPlayed++;

                        // Mettre à jour les buts marqués/encaissés
                        team1Club.goalsFor += game.Team1_Score;
                        team1Club.goalsAgainst += game.Team2_Score;
                        team2Club.goalsFor += game.Team2_Score;
                        team2Club.goalsAgainst += game.Team1_Score;

                        // Déterminer le résultat
                        if (game.Team1_Score > game.Team2_Score) {
                            // L'équipe 1 gagne
                            team1Club.wins++;
                            team1Club.points += pointsForWin;
                            team2Club.losses++;
                            team2Club.points += pointsForLoss;
                        } else if (game.Team1_Score < game.Team2_Score) {
                            // L'équipe 2 gagne
                            team2Club.wins++;
                            team2Club.points += pointsForWin;
                            team1Club.losses++;
                            team1Club.points += pointsForLoss;
                        } else {
                            // Match nul
                            team1Club.draws++;
                            team2Club.draws++;
                            team1Club.points += pointsForDraw;
                            team2Club.points += pointsForDraw;
                        }
                    }
                }
            });

            // Convertir la Map en tableau et trier
            const clubStandings = Array.from(clubsMap.values());

            // Trier le classement par points (décroissant), puis par victoires, puis par différence de buts
            clubStandings.sort((a, b) => {
                // D'abord par points
                if (b.points !== a.points) {
                    return b.points - a.points;
                }
                // Ensuite par victoires
                if (b.wins !== a.wins) {
                    return b.wins - a.wins;
                }
                // Ensuite par différence de buts
                const goalDiffA = a.goalsFor - a.goalsAgainst;
                const goalDiffB = b.goalsFor - b.goalsAgainst;
                if (goalDiffB !== goalDiffA) {
                    return goalDiffB - goalDiffA;
                }
                // Ensuite par buts marqués
                if (b.goalsFor !== a.goalsFor) {
                    return b.goalsFor - a.goalsFor;
                }
                // Enfin par matchs joués (moins de matchs joués = meilleur classement à points égaux)
                return a.matchesPlayed - b.matchesPlayed;
            });

            // Ajouter le rang à chaque club
            const rankedStandings = clubStandings.map((club, index) => ({
                ...club,
                rank: index + 1,
                goalDifference: club.goalsFor - club.goalsAgainst,
                teamIdsString: club.teamIds.join(','),
                teamIds: undefined
            }));

            // Ajouter le classement de cette poule au résultat global
            allPoolsStandings.push({
                poolId: pool.Pool_Id,
                poolName: pool.pool_name,
                categoryName: pool.category_name,
                phaseName: pool.phase_name,
                standings: rankedStandings
            });
        }

        res.status(200).json(allPoolsStandings);
    } catch (error) {
        console.error('Erreur lors de la récupération des classements:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des classements",
            error: error.message
        });
    }
};

exports.addTeamToPool = async (req, res) => {
    const { teamId } = req.body;
    const { id, tournamentId } = req.params;

    if (!teamId) {
        return res.status(400).json({ message: "L'ID de l'équipe est requis" });
    }

    try {
        // Vérifier que la poule appartient au tournoi spécifié
        const [pools] = await db.query(
            'SELECT p.* FROM Pool p JOIN Phase ph ON p.Phase_Id = ph.Phase_Id WHERE p.Pool_Id = ? AND ph.Tournament_Id = ?',
            [id, tournamentId]
        );

        if (pools.length === 0) {
            return res.status(503).json({ message: "Poule non trouvée dans ce tournoi" });
        }

        // Vérifier que l'équipe appartient au tournoi spécifié
        const [teams] = await db.query(
            'SELECT * FROM Team WHERE Team_Id = ? AND Tournament_Id = ?',
            [teamId, tournamentId]
        );

        if (teams.length === 0) {
            return res.status(400).json({ message: "Équipe non trouvée dans ce tournoi" });
        }

        await db.query(
            'INSERT INTO PoolTeam (Pool_Id, Team_Id) VALUES (?, ?)',
            [id, teamId]
        );

        res.status(201).json({
            message: "Équipe ajoutée à la poule avec succès"
        });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'équipe à la poule:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de l'ajout de l'équipe à la poule",
            error: error.message
        });
    }
};

exports.removeTeamFromPool = async (req, res) => {
    const { id, teamId, tournamentId } = req.params;

    try {
        // Vérifier que la poule appartient au tournoi spécifié
        const [pools] = await db.query(
            'SELECT p.* FROM Pool p JOIN Phase ph ON p.Phase_Id = ph.Phase_Id WHERE p.Pool_Id = ? AND ph.Tournament_Id = ?',
            [id, tournamentId]
        );

        if (pools.length === 0) {
            return res.status(503).json({ message: "Poule non trouvée dans ce tournoi" });
        }

        // Vérifier que l'équipe appartient au tournoi spécifié
        const [teams] = await db.query(
            'SELECT * FROM Team WHERE Team_Id = ? AND Tournament_Id = ?',
            [teamId, tournamentId]
        );

        if (teams.length === 0) {
            return res.status(400).json({ message: "Équipe non trouvée dans ce tournoi" });
        }

        const [result] = await db.query(
            'DELETE FROM PoolTeam WHERE Pool_Id = ? AND Team_Id = ?',
            [id, teamId]
        );

        if (result.affectedRows === 0) {
            return res.status(503).json({
                message: "Association poule-équipe non trouvée"
            });
        }

        res.status(200).json({
            message: "Équipe retirée de la poule avec succès"
        });
    } catch (error) {
        console.error('Erreur lors du retrait de l\'équipe de la poule:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors du retrait de l'équipe de la poule",
            error: error.message
        });
    }
};

// Classement global de toutes les équipes d'un tournoi (toutes poules confondues)
exports.getTournamentStandings = async (req, res) => {
    const { tournamentId } = req.params;
    try {
        // Récupérer toutes les équipes du tournoi
        const [teams] = await db.query(
            'SELECT t.* FROM Team t WHERE t.Tournament_Id = ?',
            [tournamentId]
        );
        if (teams.length === 0) {
            return res.status(200).json({ standings: [] });
        }
        // Récupérer tous les matchs du tournoi
        const [games] = await db.query(
            'SELECT * FROM Game WHERE Tournament_Id = ?',
            [tournamentId]
        );
        // Initialiser le classement
        const standings = teams.map(team => ({
            teamId: team.Team_Id,
            name: team.name,
            matchesPlayed: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            points: 0
        }));
        const standingsMap = new Map();
        standings.forEach(s => standingsMap.set(s.teamId, s));
        // Calculer les stats pour chaque match
        games.forEach(game => {
            const home = standingsMap.get(game.Home_Team_Id);
            const away = standingsMap.get(game.Away_Team_Id);
            if (!home || !away) return;
            // Mettre à jour les stats
            home.matchesPlayed++;
            away.matchesPlayed++;
            home.goalsFor += game.Home_Score;
            home.goalsAgainst += game.Away_Score;
            away.goalsFor += game.Away_Score;
            away.goalsAgainst += game.Home_Score;
            if (game.Home_Score > game.Away_Score) {
                home.wins++;
                home.points += 3;
                away.losses++;
            } else if (game.Home_Score < game.Away_Score) {
                away.wins++;
                away.points += 3;
                home.losses++;
            } else {
                home.draws++;
                away.draws++;
                home.points++;
                away.points++;
            }
        });
        // Trier le classement (points, différence de buts, buts marqués)
        standings.sort((a, b) =>
            b.points - a.points ||
            (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst) ||
            b.goalsFor - a.goalsFor
        );
        res.status(200).json({ standings });
    } catch (error) {
        console.error('Erreur lors du calcul du classement global:', error);
        res.status(500).json({ message: "Erreur lors du calcul du classement global", error: error.message });
    }
};

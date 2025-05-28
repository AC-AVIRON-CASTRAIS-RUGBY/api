const db = require('../config/db');

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
            return res.status(404).json({ message: "Poule non trouvée" });
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
            return res.status(404).json({ message: "Poule non trouvée dans ce tournoi" });
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
            return res.status(404).json({ message: "Poule non trouvée dans ce tournoi" });
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
            return res.status(404).json({ message: "Poule non trouvée dans ce tournoi" });
        }

        const [teams] = await db.query(
            'SELECT t.* FROM Team t JOIN PoolTeam pt ON t.Team_Id = pt.Team_Id WHERE pt.Pool_Id = ? AND t.Tournament_Id = ?',
            [id, tournamentId]
        );

        if (teams.length === 0) {
            return res.status(404).json({ message: "Aucune équipe trouvée dans cette poule" });
        }

        // Récupérer tous les matchs de la poule pour ce tournoi
        const [games] = await db.query(
            'SELECT * FROM Game WHERE Pool_Id = ? AND Tournament_Id = ?',
            [id, tournamentId]
        );

        // Initialiser le tableau de classement
        let standings = teams.map(team => ({
            Team_Id: team.Team_Id,
            name: team.name,
            logo: team.logo,
            matchesPlayed: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            points: 0
        }));

        // Calculer les statistiques pour chaque équipe
        games.forEach(game => {
            // Vérifier si le match a été joué
            if (game.is_completed) {
                // Trouver les équipes concernées dans le tableau de classement
                const team1Index = standings.findIndex(team => team.Team_Id === game.Team1_Id);
                const team2Index = standings.findIndex(team => team.Team_Id === game.Team2_Id);

                if (team1Index !== -1 && team2Index !== -1) {
                    // Incrémenter le nombre de matchs joués
                    standings[team1Index].matchesPlayed++;
                    standings[team2Index].matchesPlayed++;

                    // Attribuer les résultats en fonction des scores
                    if (game.Team1_Score > game.Team2_Score) {
                        // L'équipe 1 gagne
                        standings[team1Index].wins++;
                        standings[team1Index].points += 3;
                        standings[team2Index].losses++;
                    } else if (game.Team1_Score < game.Team2_Score) {
                        // L'équipe 2 gagne
                        standings[team2Index].wins++;
                        standings[team2Index].points += 3;
                        standings[team1Index].losses++;
                    } else {
                        // Match nul
                        standings[team1Index].draws++;
                        standings[team2Index].draws++;
                        standings[team1Index].points += 1;
                        standings[team2Index].points += 1;
                    }
                }
            }
        });

        // Trier le classement par points (décroissant) puis par nombre de victoires (décroissant)
        standings.sort((a, b) => {
            if (b.points !== a.points) {
                return b.points - a.points;
            }
            return b.wins - a.wins;
        });

        res.status(200).json(standings);
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
        // Récupérer toutes les équipes du tournoi associées à des poules
        const [teams] = await db.query(
            'SELECT t.* FROM Team t JOIN PoolTeam pt ON t.Team_Id = pt.Team_Id ' +
            'JOIN Pool p ON pt.Pool_Id = p.Pool_Id JOIN Phase ph ON p.Phase_Id = ph.Phase_Id ' +
            'WHERE ph.Tournament_Id = ? AND t.Tournament_Id = ?',
            [tournamentId, tournamentId]
        );

        if (teams.length === 0) {
            return res.status(404).json({ message: "Aucune équipe trouvée dans les poules de ce tournoi" });
        }

        // Initialiser le tableau de classement
        const standings = teams.map(team => ({
            Team_Id: team.Team_Id,
            name: team.name,
            logo: team.logo,
            matchesPlayed: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            points: 0
        }));

        // Récupérer tous les matchs du tournoi
        const [games] = await db.query('SELECT * FROM Game WHERE Tournament_Id = ?', [tournamentId]);

        // Calculer les statistiques pour chaque équipe
        games.forEach(game => {
            if (game.is_completed) {
                // Traitement pour l'équipe 1
                const team1Index = standings.findIndex(t => t.Team_Id === game.Team1_Id);
                const team2Index = standings.findIndex(t => t.Team_Id === game.Team2_Id);

                if (team1Index !== -1 && team2Index !== -1) {
                    // Incrémenter le nombre de matchs joués
                    standings[team1Index].matchesPlayed++;
                    standings[team2Index].matchesPlayed++;

                    // Déterminer le résultat
                    if (game.Team1_Score > game.Team2_Score) {
                        // L'équipe 1 gagne
                        standings[team1Index].wins++;
                        standings[team1Index].points += 3;
                        standings[team2Index].losses++;
                    } else if (game.Team1_Score < game.Team2_Score) {
                        // L'équipe 2 gagne
                        standings[team2Index].wins++;
                        standings[team2Index].points += 3;
                        standings[team1Index].losses++;
                    } else {
                        // Match nul
                        standings[team1Index].draws++;
                        standings[team2Index].draws++;
                        standings[team1Index].points += 1;
                        standings[team2Index].points += 1;
                    }
                }
            }
        });

        // Trier le classement
        standings.sort((a, b) => {
            if (b.points !== a.points) {
                return b.points - a.points;
            }
            return b.wins - a.wins;
        });

        // Ajouter le rang à chaque équipe
        const rankedStandings = standings.map((team, index) => ({
            ...team,
            rank: index + 1
        }));

        res.status(200).json(rankedStandings);
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
            return res.status(404).json({ message: "Poule non trouvée dans ce tournoi" });
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
            return res.status(404).json({ message: "Poule non trouvée dans ce tournoi" });
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
            return res.status(404).json({
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
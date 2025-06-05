const db = require('../config/db');

exports.getAllCategoriesByTournament = async (req, res) => {
    const { tournamentId } = req.params;

    try {
        const [rows] = await db.query(
            'SELECT * FROM Category WHERE Tournament_Id = ?',
            [tournamentId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des catégories",
            error: error.message
        });
    }
};

exports.getCategoryById = async (req, res) => {
    const { id, tournamentId } = req.params;

    try {
        const [rows] = await db.query(
            'SELECT * FROM Category WHERE Category_Id = ? AND Tournament_Id = ?',
            [id, tournamentId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération de la catégorie:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération de la catégorie",
            error: error.message
        });
    }
};

exports.createCategory = async (req, res) => {
    const { name, age_min, age_max, description, game_duration } = req.body;
    const { tournamentId } = req.params;

    if (!name) {
        return res.status(400).json({ message: "Le nom de la catégorie est requis" });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO Category (name, age_min, age_max, description, game_duration, Tournament_Id) VALUES (?, ?, ?, ?, ?, ?)',
            [name, age_min, age_max, description, game_duration || 10, tournamentId]
        );

        res.status(201).json({
            message: "Catégorie créée avec succès",
            categoryId: result.insertId
        });
    } catch (error) {
        console.error('Erreur lors de la création de la catégorie:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la création de la catégorie",
            error: error.message
        });
    }
};

exports.updateCategory = async (req, res) => {
    const { name, age_min, age_max, description, game_duration } = req.body;
    const { id, tournamentId } = req.params;

    try {
        // Vérifier que la catégorie appartient au tournoi spécifié
        const [categories] = await db.query(
            'SELECT * FROM Category WHERE Category_Id = ? AND Tournament_Id = ?',
            [id, tournamentId]
        );

        if (categories.length === 0) {
            return res.status(404).json({ message: "Catégorie non trouvée dans ce tournoi" });
        }

        const current = categories[0];

        const [result] = await db.query(
            'UPDATE Category SET name = ?, age_min = ?, age_max = ?, description = ?, game_duration = ? WHERE Category_Id = ?',
            [
                name !== undefined ? name : current.name,
                age_min !== undefined ? age_min : current.age_min,
                age_max !== undefined ? age_max : current.age_max,
                description !== undefined ? description : current.description,
                game_duration !== undefined ? game_duration : current.game_duration,
                id
            ]
        );

        res.status(200).json({ message: "Catégorie mise à jour avec succès" });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la catégorie:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la mise à jour de la catégorie",
            error: error.message
        });
    }
};

exports.deleteCategory = async (req, res) => {
    const { id, tournamentId } = req.params;

    try {
        // Vérifier que la catégorie appartient au tournoi spécifié
        const [categories] = await db.query(
            'SELECT * FROM Category WHERE Category_Id = ? AND Tournament_Id = ?',
            [id, tournamentId]
        );

        if (categories.length === 0) {
            return res.status(404).json({ message: "Catégorie non trouvée dans ce tournoi" });
        }

        const [result] = await db.query('DELETE FROM Category WHERE Category_Id = ?', [id]);
        res.status(200).json({ message: "Catégorie supprimée avec succès" });
    } catch (error) {
        console.error('Erreur lors de la suppression de la catégorie:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la suppression de la catégorie",
            error: error.message
        });
    }
};

exports.getPoolsByCategory = async (req, res) => {
    const { id, tournamentId } = req.params;

    try {
        const [rows] = await db.query(
            'SELECT p.*, ph.name as phase_name FROM Pool p ' +
            'JOIN Phase ph ON p.Phase_Id = ph.Phase_Id ' +
            'WHERE p.Category_Id = ? AND ph.Tournament_Id = ?',
            [id, tournamentId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des poules de la catégorie:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des poules",
            error: error.message
        });
    }
};

exports.getCategoryStandings = async (req, res) => {
    const { id, tournamentId } = req.params;

    try {
        // Vérifier que la catégorie appartient au tournoi spécifié
        const [categories] = await db.query(
            'SELECT * FROM Category WHERE Category_Id = ? AND Tournament_Id = ?',
            [id, tournamentId]
        );

        if (categories.length === 0) {
            return res.status(404).json({ message: "Catégorie non trouvée dans ce tournoi" });
        }

        // Récupérer les paramètres de points du tournoi
        const [tournaments] = await db.query(
            'SELECT points_win, points_draw, points_loss FROM Tournament WHERE Tournament_Id = ?',
            [tournamentId]
        );

        const pointsConfig = tournaments[0] || { points_win: 3, points_draw: 1, points_loss: 0 };

        // Récupérer toutes les équipes de cette catégorie
        const [teams] = await db.query(
            'SELECT * FROM Team WHERE age_category = ? AND Tournament_Id = ?',
            [categories[0].name, tournamentId]
        );

        if (teams.length === 0) {
            return res.status(404).json({ message: "Aucune équipe trouvée dans cette catégorie" });
        }

        const teamIds = teams.map(team => team.Team_Id);

        // Récupérer tous les matchs des équipes de cette catégorie
        const [games] = await db.query(
            `SELECT * FROM Game 
             WHERE (Team1_Id IN (${teamIds.map(() => '?').join(',')}) 
                OR Team2_Id IN (${teamIds.map(() => '?').join(',')}))
               AND Tournament_Id = ? 
               AND is_completed = 1`,
            [...teamIds, ...teamIds, tournamentId]
        );

        // Calculer les statistiques pour chaque équipe
        const teamStats = {};
        teams.forEach(team => {
            teamStats[team.Team_Id] = {
                Team_Id: team.Team_Id,
                name: team.name,
                logo: team.logo,
                paid: team.paid,
                matchesPlayed: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                points: 0
            };
        });

        games.forEach(game => {
            const team1Stats = teamStats[game.Team1_Id];
            const team2Stats = teamStats[game.Team2_Id];

            if (team1Stats && team2Stats) {
                team1Stats.matchesPlayed++;
                team2Stats.matchesPlayed++;

                if (game.Team1_Score > game.Team2_Score) {
                    // Équipe 1 gagne
                    team1Stats.wins++;
                    team1Stats.points += pointsConfig.points_win;
                    team2Stats.losses++;
                    team2Stats.points += pointsConfig.points_loss;
                } else if (game.Team1_Score < game.Team2_Score) {
                    // Équipe 2 gagne
                    team2Stats.wins++;
                    team2Stats.points += pointsConfig.points_win;
                    team1Stats.losses++;
                    team1Stats.points += pointsConfig.points_loss;
                } else {
                    // Match nul
                    team1Stats.draws++;
                    team2Stats.draws++;
                    team1Stats.points += pointsConfig.points_draw;
                    team2Stats.points += pointsConfig.points_draw;
                }
            }
        });

        // Convertir en tableau et trier
        const standings = Object.values(teamStats);
        standings.sort((a, b) => {
            if (b.points !== a.points) {
                return b.points - a.points;
            }
            if (b.wins !== a.wins) {
                return b.wins - a.wins;
            }
            return a.matchesPlayed - b.matchesPlayed;
        });

        // Ajouter le rang
        const rankedStandings = standings.map((team, index) => ({
            ...team,
            rank: index + 1
        }));

        res.status(200).json(rankedStandings);
    } catch (error) {
        console.error('Erreur lors de la récupération du classement de la catégorie:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération du classement",
            error: error.message
        });
    }
};

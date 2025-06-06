const db = require('../config/db');

exports.getAllGames = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Game');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des matchs:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des matchs",
            error: error.message
        });
    }
};

exports.getGameById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Game WHERE Game_Id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Match non trouvé" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération du match:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération du match",
            error: error.message
        });
    }
};

exports.createGame = async (req, res) => {
    const { start_time, wins, losses, draws, Team1_Id, Team2_Id, Referee_Id, Pool_Id, Tournament_Id } = req.body;

    if (!Team1_Id || !Team2_Id || !Referee_Id || !Pool_Id) {
        return res.status(400).json({ message: "Les équipes, l'arbitre et la poule sont requis" });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO Game (start_time, wins, losses, draws, Team1_Id, Team2_Id, Referee_Id, Pool_Id, Tournament_Id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [start_time, wins || 0, losses || 0, draws || 0, Team1_Id, Team2_Id, Referee_Id, Pool_Id, Tournament_Id]
        );

        res.status(201).json({
            message: "Match créé avec succès",
            gameId: result.insertId
        });
    } catch (error) {
        console.error('Erreur lors de la création du match:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la création du match",
            error: error.message
        });
    }
};

exports.updateGame = async (req, res) => {
    const gameId = req.params.id;
    const updateFields = req.body;

    // Vérifier qu'au moins un champ est fourni
    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: "Aucun champ à mettre à jour n'a été fourni" });
    }

    try {
        // Construire dynamiquement la requête UPDATE
        const allowedFields = [
            'start_time', 'Team1_Id', 'Team2_Id', 'Team1_Score', 
            'Team2_Score', 'is_completed', 'Referee_Id', 'Pool_Id', 'Field_Id'
        ];
        
        const fieldsToUpdate = [];
        const values = [];
        
        for (const [key, value] of Object.entries(updateFields)) {
            if (allowedFields.includes(key)) {
                fieldsToUpdate.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ message: "Aucun champ valide à mettre à jour" });
        }

        // Ajouter l'ID du match à la fin des valeurs
        values.push(gameId);

        const sql = `UPDATE Game SET ${fieldsToUpdate.join(', ')} WHERE Game_Id = ?`;
        
        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Match non trouvé" });
        }

        res.status(200).json({ message: "Match mis à jour avec succès" });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du match:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la mise à jour du match",
            error: error.message
        });
    }
};

exports.deleteGame = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Game WHERE Game_Id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Match non trouvé" });
        }

        res.status(200).json({ message: "Match supprimé avec succès" });
    } catch (error) {
        console.error('Erreur lors de la suppression du match:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la suppression du match",
            error: error.message
        });
    }
};

exports.getGamesByPoolId = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Game WHERE Pool_Id = ?', [req.params.poolId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des matchs de la poule:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des matchs",
            error: error.message
        });
    }
};

exports.generatePoolGames = async (req, res) => {
    const { poolId } = req.params;
    const { tournamentId } = req.query;

    if (!tournamentId) {
        return res.status(400).json({ message: "L'ID du tournoi est requis" });
    }

    try {
        // Vérifier que la poule appartient au tournoi spécifié
        const [pools] = await db.query(
            'SELECT p.* FROM Pool p JOIN Phase ph ON p.Phase_Id = ph.Phase_Id WHERE p.Pool_Id = ? AND ph.Tournament_Id = ?',
            [poolId, tournamentId]
        );

        if (pools.length === 0) {
            return res.status(404).json({ message: "Poule non trouvée dans ce tournoi" });
        }

        // Récupérer toutes les équipes de la poule
        const [teams] = await db.query(
            'SELECT t.* FROM Team t JOIN PoolTeam pt ON t.Team_Id = pt.Team_Id WHERE pt.Pool_Id = ? AND t.Tournament_Id = ?',
            [poolId, tournamentId]
        );

        if (teams.length < 2) {
            return res.status(400).json({ message: "Il faut au moins 2 équipes dans la poule pour générer des matchs" });
        }

        // Récupérer un arbitre disponible pour le tournoi
        const [referees] = await db.query(
            'SELECT * FROM Referee WHERE Tournament_Id = ? LIMIT 1',
            [tournamentId]
        );

        if (referees.length === 0) {
            return res.status(400).json({ message: "Aucun arbitre disponible pour ce tournoi" });
        }

        const refereeId = referees[0].Referee_Id;

        // Générer tous les matchs possibles (chaque équipe joue contre chaque autre équipe)
        const games = [];
        for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                games.push({
                    Team1_Id: teams[i].Team_Id,
                    Team2_Id: teams[j].Team_Id,
                    Pool_Id: poolId,
                    Referee_Id: refereeId,
                    Tournament_Id: tournamentId,
                    Team1_Score: 0,
                    Team2_Score: 0,
                    is_completed: false
                });
            }
        }

        // Insérer tous les matchs en base
        let gamesCreated = 0;
        for (const game of games) {
            await db.query(
                'INSERT INTO Game (Team1_Id, Team2_Id, Pool_Id, Referee_Id, Tournament_Id, Team1_Score, Team2_Score, is_completed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [game.Team1_Id, game.Team2_Id, game.Pool_Id, game.Referee_Id, game.Tournament_Id, game.Team1_Score, game.Team2_Score, game.is_completed]
            );
            gamesCreated++;
        }
        res.status(201).json({
            message: `${gamesCreated} matchs générés avec succès pour la poule ${poolId}`,
            gamesCreated: gamesCreated
        });
    }
    catch (error) {
        console.error('Erreur lors de la génération des matchs de la poule:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la génération des matchs",
            error: error.message
        });
    }
}

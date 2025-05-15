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
    const { start_time, wins, losses, draws, Team1_Id, Team2_Id, Referee_Id, Pool_Id } = req.body;

    if (!Team1_Id || !Team2_Id || !Referee_Id || !Pool_Id) {
        return res.status(400).json({ message: "Les équipes, l'arbitre et la poule sont requis" });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO Game (start_time, wins, losses, draws, Team1_Id, Team2_Id, Referee_Id, Pool_Id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [start_time, wins || 0, losses || 0, draws || 0, Team1_Id, Team2_Id, Referee_Id, Pool_Id]
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
    const { start_time, wins, losses, draws, Team1_Id, Team2_Id, Referee_Id, Pool_Id } = req.body;
    const gameId = req.params.id;

    try {
        const [result] = await db.query(
            'UPDATE Game SET start_time = ?, wins = ?, losses = ?, draws = ?, Team1_Id = ?, Team2_Id = ?, Referee_Id = ?, Pool_Id = ? WHERE Game_Id = ?',
            [start_time, wins, losses, draws, Team1_Id, Team2_Id, Referee_Id, Pool_Id, gameId]
        );

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
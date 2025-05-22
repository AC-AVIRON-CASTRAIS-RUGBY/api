const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getAllReferees = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Referee');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des arbitres:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des arbitres",
            error: error.message
        });
    }
};

exports.getRefereeById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Referee WHERE Referee_Id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Arbitre non trouvé" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'arbitre:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération de l'arbitre",
            error: error.message
        });
    }
};

exports.getRefereeByUUID = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Referee WHERE loginUUID = ?', [req.params.uuid]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Arbitre non trouvé" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'arbitre par UUID:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération de l'arbitre",
            error: error.message
        });
    }
};

exports.updateReferee = async (req, res) => {
    const { last_name, first_name, loginUUID, Tournament_Id } = req.body;
    const refereeId = req.params.id;

    try {
        const [result] = await db.query(
            'UPDATE Referee SET last_name = ?, first_name = ?, loginUUID = ?, Tournament_Id = ? WHERE Referee_Id = ?',
            [last_name, first_name, loginUUID, Tournament_Id, refereeId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Arbitre non trouvé" });
        }

        res.status(200).json({ message: "Arbitre mis à jour avec succès" });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'arbitre:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la mise à jour de l'arbitre",
            error: error.message
        });
    }
};

exports.deleteReferee = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Referee WHERE Referee_Id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Arbitre non trouvé" });
        }

        res.status(200).json({ message: "Arbitre supprimé avec succès" });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'arbitre:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la suppression de l'arbitre",
            error: error.message
        });
    }
};

exports.getGamesByRefereeId = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Game WHERE Referee_Id = ?', [req.params.id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des matchs:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des matchs",
            error: error.message
        });
    }
};

exports.getTournamentsByRefereeId = async (req, res) => {
    try {
        // Récupérer les tournois avec le nombre d'équipes, de poules et de matchs pour chacun
        const [rows] = await db.query(`
                    SELECT
                        t.*,
                        (SELECT COUNT(*) FROM Team WHERE Tournament_Id = t.Tournament_Id) as teams_count,
                        (SELECT COUNT(*) FROM Phase ph JOIN Pool p ON p.Phase_Id = ph.Phase_Id WHERE ph.Tournament_Id = t.Tournament_Id) as pools_count,
                        (SELECT COUNT(*) FROM Phase ph
                                                  JOIN Pool p ON p.Phase_Id = ph.Phase_Id
                                                  JOIN Game g ON g.Pool_Id = p.Pool_Id
                         WHERE ph.Tournament_Id = t.Tournament_Id) as games_count
                    FROM
                        Tournament t
                    WHERE
                        t.Referee_Id = ?`,
            [req.params.id]
        );

        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des tournois de l\'arbitre:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des tournois",
            error: error.message
        });
    }
};

exports.createReferee = async (req, res) => {
    const { last_name, first_name, Tournament_Id } = req.body;
    const uuid = require('uuid').v4(); // Génération automatique d'UUID

    try {
        const [result] = await db.query(
            'INSERT INTO Referee (last_name, first_name, loginUUID, Tournament_Id) VALUES (?, ?, ?, ?)',
            [last_name, first_name, uuid, Tournament_Id]
        );

        res.status(201).json({
            message: "Arbitre créé avec succès",
            refereeId: result.insertId,
            uuid: uuid
        });
    } catch (error) {
        console.error('Erreur lors de la création de l\'arbitre:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la création de l'arbitre",
            error: error.message
        });
    }
};

exports.getRefereesByTournamentIdDirect = async (req, res) => {
    const tournamentId = req.params.tournamentId;

    try {
        const [referees] = await db.query(
            'SELECT * FROM Referee WHERE Tournament_Id = ?',
            [tournamentId]
        );

        if (referees.length === 0) {
            return res.status(404).json({ message: "Aucun arbitre trouvé pour ce tournoi" });
        }

        res.status(200).json(referees);
    } catch (error) {
        console.error('Erreur lors de la récupération des arbitres du tournoi:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des arbitres du tournoi",
            error: error.message
        });
    }
};
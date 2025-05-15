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

exports.createReferee = async (req, res) => {
    const { last_name, first_name, loginUUID } = req.body;

    if (!last_name || !first_name) {
        return res.status(400).json({ message: "Le nom et le prénom sont requis" });
    }

    // Générer un UUID si non fourni
    const uuid = loginUUID || uuidv4();

    try {
        const [result] = await db.query(
            'INSERT INTO Referee (last_name, first_name, loginUUID) VALUES (?, ?, ?)',
            [last_name, first_name, uuid]
        );

        res.status(201).json({
            message: "Arbitre créé avec succès",
            refereeId: result.insertId,
            loginUUID: uuid
        });
    } catch (error) {
        console.error('Erreur lors de la création de l\'arbitre:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la création de l'arbitre",
            error: error.message
        });
    }
};

exports.updateReferee = async (req, res) => {
    const { last_name, first_name, loginUUID } = req.body;
    const refereeId = req.params.id;

    try {
        const [result] = await db.query(
            'UPDATE Referee SET last_name = ?, first_name = ?, loginUUID = ? WHERE Referee_Id = ?',
            [last_name, first_name, loginUUID, refereeId]
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
const db = require('../config/db');

exports.getAllTeams = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Team');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des équipes:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des équipes",
            error: error.message
        });
    }
};

exports.getTeamById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Team WHERE Team_Id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Équipe non trouvée" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'équipe:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération de l'équipe",
            error: error.message
        });
    }
};

exports.createTeam = async (req, res) => {
    const { name, logo, age_category, Pool_Id, Tournament_Id } = req.body;

    if (!name || !Pool_Id || !Tournament_Id) {
        return res.status(400).json({ message: "Le nom, l'ID de poule et l'ID de tournoi sont requis" });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO Team (name, logo, age_category, Pool_Id, Tournament_Id) VALUES (?, ?, ?, ?, ?)',
            [name, logo, age_category, Pool_Id, Tournament_Id]
        );

        res.status(201).json({
            message: "Équipe créée avec succès",
            teamId: result.insertId
        });
    } catch (error) {
        console.error('Erreur lors de la création de l\'équipe:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la création de l'équipe",
            error: error.message
        });
    }
};

exports.updateTeam = async (req, res) => {
    const { name, logo, age_category, Pool_Id, Tournament_Id } = req.body;
    const teamId = req.params.id;

    try {
        const [result] = await db.query(
            'UPDATE Team SET name = ?, logo = ?, age_category = ?, Pool_Id = ?, Tournament_Id = ? WHERE Team_Id = ?',
            [name, logo, age_category, Pool_Id, Tournament_Id, teamId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Équipe non trouvée" });
        }

        res.status(200).json({ message: "Équipe mise à jour avec succès" });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'équipe:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la mise à jour de l'équipe",
            error: error.message
        });
    }
};

exports.deleteTeam = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Team WHERE Team_Id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Équipe non trouvée" });
        }

        res.status(200).json({ message: "Équipe supprimée avec succès" });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'équipe:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la suppression de l'équipe",
            error: error.message
        });
    }
};

exports.getGamesByTeamId = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM Game WHERE Team1_Id = ? OR Team2_Id = ?',
            [req.params.id, req.params.id]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des matchs:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des matchs",
            error: error.message
        });
    }
};

exports.getLockerRoomByTeamId = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM LockerRoom WHERE Team_Id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Aucun vestiaire trouvé pour cette équipe" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération du vestiaire:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération du vestiaire",
            error: error.message
        });
    }
};
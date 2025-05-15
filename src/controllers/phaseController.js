const db = require('../config/db');

exports.getAllPhases = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Phase');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des phases:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des phases",
            error: error.message
        });
    }
};

exports.getPhaseById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Phase WHERE Phase_Id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Phase non trouvée" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération de la phase:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération de la phase",
            error: error.message
        });
    }
};

exports.createPhase = async (req, res) => {
    const { name, Tournament_Id } = req.body;

    if (!name || !Tournament_Id) {
        return res.status(400).json({ message: "Le nom et l'ID du tournoi sont requis" });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO Phase (name, Tournament_Id) VALUES (?, ?)',
            [name, Tournament_Id]
        );

        res.status(201).json({
            message: "Phase créée avec succès",
            phaseId: result.insertId
        });
    } catch (error) {
        console.error('Erreur lors de la création de la phase:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la création de la phase",
            error: error.message
        });
    }
};

exports.updatePhase = async (req, res) => {
    const { name, Tournament_Id } = req.body;
    const phaseId = req.params.id;

    try {
        const [result] = await db.query(
            'UPDATE Phase SET name = ?, Tournament_Id = ? WHERE Phase_Id = ?',
            [name, Tournament_Id, phaseId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Phase non trouvée" });
        }

        res.status(200).json({ message: "Phase mise à jour avec succès" });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la phase:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la mise à jour de la phase",
            error: error.message
        });
    }
};

exports.deletePhase = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Phase WHERE Phase_Id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Phase non trouvée" });
        }

        res.status(200).json({ message: "Phase supprimée avec succès" });
    } catch (error) {
        console.error('Erreur lors de la suppression de la phase:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la suppression de la phase",
            error: error.message
        });
    }
};

exports.getPoolsByPhaseId = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Pool WHERE Phase_Id = ?', [req.params.id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des poules de la phase:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des poules",
            error: error.message
        });
    }
};
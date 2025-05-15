const db = require('../config/db');

exports.getAllPools = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Pool');
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
    try {
        const [rows] = await db.query('SELECT * FROM Pool WHERE Pool_Id = ?', [req.params.id]);

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
};

exports.createPool = async (req, res) => {
    const { name, Phase_Id } = req.body;

    if (!name || !Phase_Id) {
        return res.status(400).json({ message: "Le nom et l'ID de phase sont requis" });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO Pool (name, Phase_Id) VALUES (?, ?)',
            [name, Phase_Id]
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
    const { name, Phase_Id } = req.body;
    const poolId = req.params.id;

    try {
        const [result] = await db.query(
            'UPDATE Pool SET name = ?, Phase_Id = ? WHERE Pool_Id = ?',
            [name, Phase_Id, poolId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Poule non trouvée" });
        }

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
    try {
        const [result] = await db.query('DELETE FROM Pool WHERE Pool_Id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Poule non trouvée" });
        }

        res.status(200).json({ message: "Poule supprimée avec succès" });
    } catch (error) {
        console.error('Erreur lors de la suppression de la poule:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la suppression de la poule",
            error: error.message
        });
    }
};

exports.getTeamsByPoolId = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Team WHERE Pool_Id = ?', [req.params.id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des équipes de la poule:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des équipes",
            error: error.message
        });
    }
};
const db = require('../config/db');

exports.getAllLockerRooms = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM LockerRoom');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des vestiaires:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des vestiaires",
            error: error.message
        });
    }
};

exports.getLockerRoomById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM LockerRoom WHERE LockerRoom_Id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Vestiaire non trouvé" });
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

exports.createLockerRoom = async (req, res) => {
    const { number, Team_Id } = req.body;

    if (!number || !Team_Id) {
        return res.status(400).json({ message: "Le numéro et l'ID de l'équipe sont requis" });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO LockerRoom (number, Team_Id) VALUES (?, ?)',
            [number, Team_Id]
        );

        res.status(201).json({
            message: "Vestiaire créé avec succès",
            lockerRoomId: result.insertId
        });
    } catch (error) {
        console.error('Erreur lors de la création du vestiaire:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la création du vestiaire",
            error: error.message
        });
    }
};

exports.updateLockerRoom = async (req, res) => {
    const { number, Team_Id } = req.body;
    const lockerRoomId = req.params.id;

    try {
        const [result] = await db.query(
            'UPDATE LockerRoom SET number = ?, Team_Id = ? WHERE LockerRoom_Id = ?',
            [number, Team_Id, lockerRoomId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Vestiaire non trouvé" });
        }

        res.status(200).json({ message: "Vestiaire mis à jour avec succès" });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du vestiaire:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la mise à jour du vestiaire",
            error: error.message
        });
    }
};

exports.deleteLockerRoom = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM LockerRoom WHERE LockerRoom_Id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Vestiaire non trouvé" });
        }

        res.status(200).json({ message: "Vestiaire supprimé avec succès" });
    } catch (error) {
        console.error('Erreur lors de la suppression du vestiaire:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la suppression du vestiaire",
            error: error.message
        });
    }
};

exports.getLockerRoomByTeamId = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM LockerRoom WHERE Team_Id = ?', [req.params.teamId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Aucun vestiaire trouvé pour cette équipe" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération du vestiaire par équipe:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération du vestiaire",
            error: error.message
        });
    }
};
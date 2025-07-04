const db = require('../config/db');

exports.getAllTeams = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Team WHERE Tournament_Id = ?', [req.params.tournamentId]);
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
        const [rows] = await db.query('SELECT * FROM Team WHERE Team_Id = ? AND Tournament_Id = ?',
            [req.params.id, req.params.tournamentId]);

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
    const { name, logo, Category_Id, paid } = req.body;
    const Tournament_Id = req.params.tournamentId;

    if (!name) {
        return res.status(400).json({ message: "Le nom de l'équipe est requis" });
    }

    try {
        // Si Category_Id est fourni, vérifier qu'il existe dans le tournoi
        if (Category_Id) {
            const [categories] = await db.query(
                'SELECT * FROM Category WHERE Category_Id = ? AND Tournament_Id = ?',
                [Category_Id, Tournament_Id]
            );
            
            if (categories.length === 0) {
                return res.status(400).json({ 
                    message: "Catégorie non trouvée dans ce tournoi" 
                });
            }
        }

        const [result] = await db.query(
            'INSERT INTO Team (name, logo, Category_Id, paid, Tournament_Id) VALUES (?, ?, ?, ?, ?)',
            [name, logo || null, Category_Id || null, paid || false, Tournament_Id]
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
    const { name, logo, Category_Id, paid } = req.body;
    const teamId = req.params.id;
    const Tournament_Id = req.params.tournamentId;

    try {
        // Récupérer d'abord les valeurs actuelles
        const [currentTeam] = await db.query(
            'SELECT * FROM Team WHERE Team_Id = ? AND Tournament_Id = ?',
            [teamId, Tournament_Id]
        );

        if (currentTeam.length === 0) {
            return res.status(404).json({ message: "Équipe non trouvée" });
        }

        const current = currentTeam[0];

        // Si Category_Id est fourni, vérifier qu'il existe dans le tournoi
        if (Category_Id !== undefined && Category_Id !== null) {
            const [categories] = await db.query(
                'SELECT * FROM Category WHERE Category_Id = ? AND Tournament_Id = ?',
                [Category_Id, Tournament_Id]
            );
            
            if (categories.length === 0) {
                return res.status(400).json({ 
                    message: "Catégorie non trouvée dans ce tournoi" 
                });
            }
        }

        // Construire la requête avec les valeurs fournies ou existantes
        const [result] = await db.query(
            'UPDATE Team SET name = ?, logo = ?, Category_Id = ?, paid = ? WHERE Team_Id = ? AND Tournament_Id = ?',
            [
                name !== undefined ? name : current.name,
                logo !== undefined ? logo : current.logo,
                Category_Id !== undefined ? Category_Id : current.Category_Id,
                paid !== undefined ? paid : current.paid,
                teamId,
                Tournament_Id
            ]
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
        const [result] = await db.query('DELETE FROM Team WHERE Team_Id = ? AND Tournament_Id = ?',
            [req.params.id, req.params.tournamentId]);

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
            `SELECT g.* FROM Game g
             JOIN Team t ON (g.Team1_Id = t.Team_Id OR g.Team2_Id = t.Team_Id)
             WHERE t.Team_Id = ? AND t.Tournament_Id = ?`,
            [req.params.id, req.params.tournamentId]
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
        const [teamExists] = await db.query(
            'SELECT * FROM Team WHERE Team_Id = ? AND Tournament_Id = ?',
            [req.params.id, req.params.tournamentId]
        );

        if (teamExists.length === 0) {
            return res.status(404).json({ message: "Équipe non trouvée" });
        }

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
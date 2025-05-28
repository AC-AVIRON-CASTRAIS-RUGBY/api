const db = require('../config/db');

exports.getPlayersByTeamId = async (req, res) => {
    try {
        // Vérifier si l'équipe existe
        const [teamExists] = await db.query(
            'SELECT * FROM Team WHERE Team_Id = ? AND Tournament_Id = ?',
            [req.params.teamId, req.params.tournamentId]
        );

        if (teamExists.length === 0) {
            return res.status(404).json({ message: "Équipe non trouvée" });
        }

        // Récupérer tous les joueurs de l'équipe
        const [players] = await db.query(
            'SELECT * FROM Player WHERE Team_Id = ? ORDER BY number',
            [req.params.teamId]
        );

        res.status(200).json(players);
    } catch (error) {
        console.error('Erreur lors de la récupération des joueurs:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des joueurs",
            error: error.message
        });
    }
};

exports.getPlayerById = async (req, res) => {
    try {
        // Vérifier si l'équipe existe
        const [teamExists] = await db.query(
            'SELECT * FROM Team WHERE Team_Id = ? AND Tournament_Id = ?',
            [req.params.teamId, req.params.tournamentId]
        );

        if (teamExists.length === 0) {
            return res.status(404).json({ message: "Équipe non trouvée" });
        }

        // Récupérer le joueur
        const [players] = await db.query(
            'SELECT * FROM Player WHERE Player_Id = ? AND Team_Id = ?',
            [req.params.id, req.params.teamId]
        );

        if (players.length === 0) {
            return res.status(404).json({ message: "Joueur non trouvé" });
        }

        res.status(200).json(players[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération du joueur:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération du joueur",
            error: error.message
        });
    }
};

exports.createPlayer = async (req, res) => {
    const { first_name, last_name, number, position } = req.body;
    const teamId = req.params.teamId;

    // Validation des données
    if (!first_name || !last_name) {
        return res.status(400).json({ message: "Le prénom et le nom du joueur sont requis" });
    }

    try {
        // Vérifier si l'équipe existe
        const [teamExists] = await db.query(
            'SELECT * FROM Team WHERE Team_Id = ? AND Tournament_Id = ?',
            [teamId, req.params.tournamentId]
        );

        if (teamExists.length === 0) {
            return res.status(404).json({ message: "Équipe non trouvée" });
        }

        // Insérer le joueur
        const [result] = await db.query(
            'INSERT INTO Player (first_name, last_name, number, position, Team_Id) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, number, position, teamId]
        );

        res.status(201).json({
            message: "Joueur créé avec succès",
            playerId: result.insertId
        });
    } catch (error) {
        console.error('Erreur lors de la création du joueur:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la création du joueur",
            error: error.message
        });
    }
};

exports.updatePlayer = async (req, res) => {
    const { first_name, last_name, number, position } = req.body;
    const playerId = req.params.id;
    const teamId = req.params.teamId;
    const tournamentId = req.params.tournamentId;

    try {
        // Vérifier si l'équipe existe
        const [teamExists] = await db.query(
            'SELECT * FROM Team WHERE Team_Id = ? AND Tournament_Id = ?',
            [teamId, tournamentId]
        );

        if (teamExists.length === 0) {
            return res.status(404).json({ message: "Équipe non trouvée" });
        }

        // Récupérer les valeurs actuelles du joueur
        const [currentPlayer] = await db.query(
            'SELECT * FROM Player WHERE Player_Id = ? AND Team_Id = ?',
            [playerId, teamId]
        );

        if (currentPlayer.length === 0) {
            return res.status(404).json({ message: "Joueur non trouvé" });
        }

        const current = currentPlayer[0];

        // Mettre à jour le joueur avec les valeurs fournies ou existantes
        const [result] = await db.query(
            'UPDATE Player SET first_name = ?, last_name = ?, number = ?, position = ? WHERE Player_Id = ? AND Team_Id = ?',
            [
                first_name !== undefined ? first_name : current.first_name,
                last_name !== undefined ? last_name : current.last_name,
                number !== undefined ? number : current.number,
                position !== undefined ? position : current.position,
                playerId,
                teamId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Joueur non trouvé" });
        }

        res.status(200).json({ message: "Joueur mis à jour avec succès" });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du joueur:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la mise à jour du joueur",
            error: error.message
        });
    }
};

exports.deletePlayer = async (req, res) => {
    try {
        // Vérifier si l'équipe existe
        const [teamExists] = await db.query(
            'SELECT * FROM Team WHERE Team_Id = ? AND Tournament_Id = ?',
            [req.params.teamId, req.params.tournamentId]
        );

        if (teamExists.length === 0) {
            return res.status(404).json({ message: "Équipe non trouvée" });
        }

        // Supprimer le joueur
        const [result] = await db.query(
            'DELETE FROM Player WHERE Player_Id = ? AND Team_Id = ?',
            [req.params.id, req.params.teamId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Joueur non trouvé" });
        }

        res.status(200).json({ message: "Joueur supprimé avec succès" });
    } catch (error) {
        console.error('Erreur lors de la suppression du joueur:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la suppression du joueur",
            error: error.message
        });
    }
};
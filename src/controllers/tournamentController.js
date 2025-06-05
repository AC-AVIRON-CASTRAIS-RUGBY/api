const db = require('../config/db');

exports.getAllTournaments = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Tournament');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des tournois:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des tournois",
            error: error.message
        });
    }
};

exports.getTournamentById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Tournament WHERE Tournament_Id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Tournoi non trouvé" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération du tournoi:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération du tournoi",
            error: error.message
        });
    }
};

exports.createTournament = async (req, res) => {
    const { name, description, start_date, location, break_time, points_win, points_draw, points_loss } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO Tournament (name, description, start_date, location, break_time, points_win, points_draw, points_loss) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, description, start_date, location, break_time || 5, points_win || 3, points_draw || 1, points_loss || 0]
        );

        res.status(201).json({
            message: "Tournoi créé avec succès",
            tournamentId: result.insertId
        });
    } catch (error) {
        console.error('Erreur lors de la création du tournoi:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la création du tournoi",
            error: error.message
        });
    }
};

exports.updateTournament = async (req, res) => {
    const { name, description, start_date, location, break_time, points_win, points_draw, points_loss } = req.body;
    const tournamentId = req.params.id;

    try {
        // Récupérer d'abord les valeurs actuelles
        const [currentTournament] = await db.query(
            'SELECT * FROM Tournament WHERE Tournament_Id = ?',
            [tournamentId]
        );

        if (currentTournament.length === 0) {
            return res.status(404).json({ message: "Tournoi non trouvé" });
        }

        const current = currentTournament[0];

        // Construire la requête dynamiquement avec les valeurs fournies ou existantes
        const [result] = await db.query(
            'UPDATE Tournament SET name = ?, description = ?, start_date = ?, location = ?, break_time = ?, points_win = ?, points_draw = ?, points_loss = ? WHERE Tournament_Id = ?',
            [
                name !== undefined ? name : current.name,
                description !== undefined ? description : current.description,
                start_date !== undefined ? start_date : current.start_date,
                location !== undefined ? location : current.location,
                break_time !== undefined ? break_time : (current.break_time || 5),
                points_win !== undefined ? points_win : (current.points_win || 3),
                points_draw !== undefined ? points_draw : (current.points_draw || 1),
                points_loss !== undefined ? points_loss : (current.points_loss || 0),
                tournamentId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Tournoi non trouvé" });
        }

        res.status(200).json({ message: "Tournoi mis à jour avec succès" });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du tournoi:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la mise à jour du tournoi",
            error: error.message
        });
    }
};

exports.deleteTournament = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Tournament WHERE Tournament_Id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Tournoi non trouvé" });
        }

        res.status(200).json({ message: "Tournoi supprimé avec succès" });
    } catch (error) {
        console.error('Erreur lors de la suppression du tournoi:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la suppression du tournoi",
            error: error.message
        });
    }
};
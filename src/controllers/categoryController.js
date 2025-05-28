const db = require('../config/db');

exports.getAllCategoriesByTournament = async (req, res) => {
    const { tournamentId } = req.params;

    try {
        const [rows] = await db.query(
            'SELECT * FROM Category WHERE Tournament_Id = ?',
            [tournamentId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des catégories",
            error: error.message
        });
    }
};

exports.getCategoryById = async (req, res) => {
    const { id, tournamentId } = req.params;

    try {
        const [rows] = await db.query(
            'SELECT * FROM Category WHERE Category_Id = ? AND Tournament_Id = ?',
            [id, tournamentId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération de la catégorie:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération de la catégorie",
            error: error.message
        });
    }
};

exports.createCategory = async (req, res) => {
    const { name, age_min, age_max, description } = req.body;
    const { tournamentId } = req.params;

    if (!name) {
        return res.status(400).json({ message: "Le nom de la catégorie est requis" });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO Category (name, age_min, age_max, description, Tournament_Id) VALUES (?, ?, ?, ?, ?)',
            [name, age_min, age_max, description, tournamentId]
        );

        res.status(201).json({
            message: "Catégorie créée avec succès",
            categoryId: result.insertId
        });
    } catch (error) {
        console.error('Erreur lors de la création de la catégorie:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la création de la catégorie",
            error: error.message
        });
    }
};

exports.updateCategory = async (req, res) => {
    const { name, age_min, age_max, description } = req.body;
    const { id, tournamentId } = req.params;

    try {
        // Vérifier que la catégorie appartient au tournoi spécifié
        const [categories] = await db.query(
            'SELECT * FROM Category WHERE Category_Id = ? AND Tournament_Id = ?',
            [id, tournamentId]
        );

        if (categories.length === 0) {
            return res.status(404).json({ message: "Catégorie non trouvée dans ce tournoi" });
        }

        const current = categories[0];

        const [result] = await db.query(
            'UPDATE Category SET name = ?, age_min = ?, age_max = ?, description = ? WHERE Category_Id = ?',
            [
                name !== undefined ? name : current.name,
                age_min !== undefined ? age_min : current.age_min,
                age_max !== undefined ? age_max : current.age_max,
                description !== undefined ? description : current.description,
                id
            ]
        );

        res.status(200).json({ message: "Catégorie mise à jour avec succès" });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la catégorie:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la mise à jour de la catégorie",
            error: error.message
        });
    }
};

exports.deleteCategory = async (req, res) => {
    const { id, tournamentId } = req.params;

    try {
        // Vérifier que la catégorie appartient au tournoi spécifié
        const [categories] = await db.query(
            'SELECT * FROM Category WHERE Category_Id = ? AND Tournament_Id = ?',
            [id, tournamentId]
        );

        if (categories.length === 0) {
            return res.status(404).json({ message: "Catégorie non trouvée dans ce tournoi" });
        }

        const [result] = await db.query('DELETE FROM Category WHERE Category_Id = ?', [id]);
        res.status(200).json({ message: "Catégorie supprimée avec succès" });
    } catch (error) {
        console.error('Erreur lors de la suppression de la catégorie:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la suppression de la catégorie",
            error: error.message
        });
    }
};

exports.getPoolsByCategory = async (req, res) => {
    const { id, tournamentId } = req.params;

    try {
        const [rows] = await db.query(
            'SELECT p.*, ph.name as phase_name FROM Pool p ' +
            'JOIN Phase ph ON p.Phase_Id = ph.Phase_Id ' +
            'WHERE p.Category_Id = ? AND ph.Tournament_Id = ?',
            [id, tournamentId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des poules de la catégorie:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la récupération des poules",
            error: error.message
        });
    }
};

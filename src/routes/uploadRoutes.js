const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configuration du stockage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../uploads');
        
        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Générer un nom unique pour éviter les conflits
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const newFileName = file.fieldname + '-' + uniqueSuffix + ext;
        cb(null, newFileName);
    }
});

// Filtrage des fichiers (seulement les images)
const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier non autorisé. Seules les images sont acceptées.'), false);
    }
};

// Configuration de multer
const upload = multer({
    storage: storage,
        fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite de 5MB
    }
});

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Upload d'une image
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Fichier image à uploader
 *     responses:
 *       200:
 *         description: Image uploadée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 url:
 *                   type: string
 *                 filename:
 *                   type: string
 *       400:
 *         description: Erreur de validation ou type de fichier non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.post('/image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Aucun fichier n'a été envoyé" });
        }

        // Construire l'URL d'accès au fichier
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

        const response = {
            message: "Image uploadée avec succès",
            url: fileUrl,
            filename: req.file.filename
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de l'upload",
            error: error.message
        });
    }
});

/**
 * @swagger
 * /upload/team-logo:
 *   post:
 *     summary: Upload du logo d'une équipe
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Fichier image du logo
 *     responses:
 *       200:
 *         description: Logo uploadé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 filename:
 *                   type: string
 *                 url:
 *                   type: string
 *       400:
 *         description: Aucun fichier uploadé ou format invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/team-logo', upload.single('logo'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier uploadé' });
        }

        res.status(200).json({
            message: 'Logo uploadé avec succès',
            filename: req.file.filename,
            url: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        res.status(500).json({
            message: 'Erreur lors de l\'upload du fichier',
            error: error.message
        });
    }
});

// Gestion des erreurs multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: "Le fichier est trop volumineux (max 5MB)" });
        }
    }
    
    if (error.message === 'Type de fichier non autorisé. Seules les images sont acceptées.') {
        return res.status(400).json({ message: error.message });
    }
    
    console.error('Erreur upload:', error);
    res.status(500).json({ message: "Erreur lors de l'upload", error: error.message });
});

module.exports = router;

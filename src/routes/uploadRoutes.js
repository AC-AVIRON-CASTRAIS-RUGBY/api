const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

console.info('📁 Module uploadRoutes initialisé');

// Configuration du stockage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.info('🎯 Configuration destination pour upload');
        const uploadDir = path.join(__dirname, '../../uploads');
        console.info(`📂 Répertoire d'upload: ${uploadDir}`);
        
        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(uploadDir)) {
            console.info('📁 Création du dossier uploads car inexistant');
            fs.mkdirSync(uploadDir, { recursive: true });
            console.info('✅ Dossier uploads créé avec succès');
        } else {
            console.info('✅ Dossier uploads existe déjà');
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        console.info('🏷️ Génération du nom de fichier');
        console.info(`📄 Fichier original: ${file.originalname}`);
        console.info(`📋 Type MIME: ${file.mimetype}`);
        
        // Générer un nom unique pour éviter les conflits
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const newFileName = file.fieldname + '-' + uniqueSuffix + ext;
        
        console.info(`🆔 Nom de fichier généré: ${newFileName}`);
        cb(null, newFileName);
    }
});

// Filtrage des fichiers (seulement les images)
const fileFilter = (req, file, cb) => {
    console.info('🔍 Vérification du type de fichier');
    console.info(`📄 Fichier: ${file.originalname}, Type: ${file.mimetype}`);
    
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedMimes.includes(file.mimetype)) {
        console.info('✅ Type de fichier autorisé');
        cb(null, true);
    } else {
        console.info(`❌ Type de fichier non autorisé: ${file.mimetype}`);
        console.info(`📋 Types autorisés: ${allowedMimes.join(', ')}`);
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

console.info('⚙️ Configuration multer terminée');

/**
 * @swagger
 * /api/upload/image:
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
    console.info('🚀 Début de l\'upload d\'image');
    console.info(`📡 Requête reçue de: ${req.ip}`);
    console.info(`🌐 User-Agent: ${req.get('User-Agent')}`);
    
    try {
        if (!req.file) {
            console.info('❌ Aucun fichier reçu dans la requête');
            return res.status(400).json({ message: "Aucun fichier n'a été envoyé" });
        }

        console.info('📁 Informations du fichier uploadé:');
        console.info(`  - Nom original: ${req.file.originalname}`);
        console.info(`  - Nom généré: ${req.file.filename}`);
        console.info(`  - Taille: ${req.file.size} bytes (${(req.file.size / 1024 / 1024).toFixed(2)} MB)`);
        console.info(`  - Type MIME: ${req.file.mimetype}`);
        console.info(`  - Chemin: ${req.file.path}`);

        // Construire l'URL d'accès au fichier
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
        
        console.info(`🔗 URL d'accès générée: ${fileUrl}`);

        const response = {
            message: "Image uploadée avec succès",
            url: fileUrl,
            filename: req.file.filename
        };

        console.info('✅ Upload terminé avec succès');
        console.info(`📤 Réponse envoyée: ${JSON.stringify(response)}`);
        
        res.status(200).json(response);
    } catch (error) {
        console.error('💥 Erreur lors de l\'upload:', error);
        console.error(`📋 Stack trace: ${error.stack}`);
        res.status(500).json({
            message: "Une erreur est survenue lors de l'upload",
            error: error.message
        });
    }
});

// Gestion des erreurs multer
router.use((error, req, res, next) => {
    console.error('⚠️ Erreur multer détectée:', error.message);
    
    if (error instanceof multer.MulterError) {
        console.error(`🔧 Type d'erreur multer: ${error.code}`);
        if (error.code === 'LIMIT_FILE_SIZE') {
            console.error(`📏 Fichier trop volumineux. Limite: 5MB`);
            return res.status(400).json({ message: "Le fichier est trop volumineux (max 5MB)" });
        }
    }
    
    if (error.message === 'Type de fichier non autorisé. Seules les images sont acceptées.') {
        console.error('🚫 Type de fichier rejeté');
        return res.status(400).json({ message: error.message });
    }
    
    console.error('💥 Erreur non gérée:', error);
    res.status(500).json({ message: "Erreur lors de l'upload", error: error.message });
});

console.info('🛣️ Route upload configurée et prête');

module.exports = router;

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Import des routes
const indexRoutes = require('./routes/index');
const tournamentRoutes = require('./routes/tournamentRoutes');
const teamRoutes = require('./routes/teamRoutes');
const gameRoutes = require('./routes/gameRoutes');
const poolRoutes = require('./routes/poolRoutes');
const phaseRoutes = require('./routes/phaseRoutes');
const refereeRoutes = require('./routes/refereeRoutes');
const lockerRoomRoutes = require('./routes/lockerRoomRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Documentation Swagger
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/', indexRoutes);
app.use('/tournaments', tournamentRoutes);
app.use('/teams', teamRoutes);
app.use('/games', gameRoutes);
app.use('/pools', poolRoutes);
app.use('/phases', phaseRoutes);
app.use('/referees', refereeRoutes);
app.use('/locker-rooms', lockerRoomRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/upload', uploadRoutes);

// Gestion des erreurs 404
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion globale des erreurs
app.use((error, req, res, next) => {
    console.error('Erreur globale:', error);
    res.status(500).json({ 
        message: 'Erreur interne du serveur',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    });
});

module.exports = app;
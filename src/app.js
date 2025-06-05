const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const tournamentRoutes = require('./routes/tournamentRoutes');
const poolRoutes = require('./routes/poolRoutes');
const teamRoutes = require('./routes/teamRoutes');
const gameRoutes = require('./routes/gameRoutes');
const phaseRoutes = require('./routes/phaseRoutes');
const lockerRoomRoutes = require('./routes/lockerRoomRoutes');
const refereeRoutes = require('./routes/refereeRoutes');
const authRoutes = require('./routes/authRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Configuration CORS
const corsOptions = {
    origin: ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Servir les fichiers statiques depuis le dossier uploads
app.use('/uploads', express.static('uploads'));

app.use('/', routes);

app.use('/api/health', (req, res) => {
    return res.status(200).json({ status: 'live' });
});

app.use('/api/tournaments', tournamentRoutes);
app.use('/api/pools', poolRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/phases', phaseRoutes);
app.use('/api/locker-rooms', lockerRoomRoutes);
app.use('/api/referees', refereeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoryRoutes);

const swaggerSettings = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de gestion de tournois',
            version: '1.0.0',
            description: 'API pour gérer les tournois, les équipes, les matchs et le calendrier',
            contact: {
                name: 'Admin'
            }
        },
        servers: [{
            url: 'http://localhost:3000'
        }]
    },
    apis: [
        './src/controllers/*.js',
        './src/routes/*.js',
        './src/models/swagger.js'
    ]
};

const swaggerDocs = swaggerJsDoc(swaggerSettings);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;
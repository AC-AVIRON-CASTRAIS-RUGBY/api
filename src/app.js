const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

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
    origin: ['https://avironcastrais.fr', 'https://api.avironcastrais.fr', 'https://app.avironcastrais.fr', 'http://localhost:3000', 'http://localhost:80', 'http://localhost'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Servir les fichiers statiques depuis le dossier uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/', routes);

app.use('/health', (req, res) => {
    return res.status(200).json({ status: 'live' });
});

// Routes
app.use('/tournaments', tournamentRoutes);
app.use('/teams', teamRoutes);
app.use('/games', gameRoutes);
app.use('/referees', refereeRoutes);
app.use('/pools', poolRoutes);
app.use('/phases', phaseRoutes);
app.use('/locker-rooms', lockerRoomRoutes);
app.use('/categories', categoryRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);

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
            url: 'https://api.avironcastrais.fr'
        }]
    },
    apis: [
        path.join(__dirname, 'controllers/*.js'),
        path.join(__dirname, 'routes/*.js'),
        path.join(__dirname, 'models/swagger.js')
    ]
};

// Ajout : génération du spec et montage de Swagger UI
const specs = swaggerJsDoc(swaggerSettings);

// UI interactive
app.use('/doc', swaggerUi.serve, swaggerUi.setup(specs));
// JSON brut si besoin
app.get('/doc.json', (req, res) => res.json(specs));

module.exports = app;
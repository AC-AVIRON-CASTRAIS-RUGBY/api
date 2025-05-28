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
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
};

app.use(cors(corsOptions));
console.info('🌐 CORS configuré pour les origines:', corsOptions.origin);

app.use(express.json());

// Middleware de debug global pour toutes les routes
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.info(`🌐 [${timestamp}] ${req.method} ${req.originalUrl}`);
    console.info(`📍 IP: ${req.ip}`);
    console.info(`🔗 User-Agent: ${req.get('User-Agent') || 'Non défini'}`);
    console.info(`🔗 Origin: ${req.get('Origin') || 'Non défini'}`);
    
    if (req.method !== 'GET') {
        console.info(`📦 Body: ${JSON.stringify(req.body)}`);
    }
    
    if (Object.keys(req.query).length > 0) {
        console.info(`🔍 Query params: ${JSON.stringify(req.query)}`);
    }
    
    if (Object.keys(req.params).length > 0) {
        console.info(`🎯 Route params: ${JSON.stringify(req.params)}`);
    }
    
    // Log de la réponse
    const originalSend = res.send;
    res.send = function(data) {
        console.info(`📤 [${timestamp}] Réponse ${res.statusCode} pour ${req.method} ${req.originalUrl}`);
        originalSend.call(this, data);
    };
    
    next();
});

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
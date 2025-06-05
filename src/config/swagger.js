const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de gestion de tournois',
            version: '1.0.0',
            description: 'API pour gérer les tournois, les équipes, les matchs et le calendrier',
        },
        servers: [
            {
                url: 'https://api.avironcastrais.fr',
                description: 'Serveur de production',
            },
            {
                url: 'http://localhost:3000',
                description: 'Serveur de développement',
            }
        ],
    },
    apis: [
        './src/routes/*.js',
        './src/models/swagger.js',
        './src/controllers/*.js'
    ],
};

const specs = swaggerJSDoc(options);

module.exports = specs;

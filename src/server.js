require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\x1b[36m🚀 Serveur démarré sur le port ${PORT}\x1b[0m`);
    console.log(`\x1b[36m📚 Documentation disponible sur http://localhost:${PORT}/doc\x1b[0m`);
});
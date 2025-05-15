const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

try {
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    console.log('\x1b[32mConnexion à la base de données établie avec succès\x1b[0m');
} catch (error) {
    console.error('\x1b[31mErreur lors de la création du pool de connexion à la base de données :\x1b[0m', error.message);
    process.exit(1);
}

module.exports = pool;
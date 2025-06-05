const db = require('./src/config/db');
const bcrypt = require('bcrypt');

async function migrateData() {
    try {
        console.log('🔍 Vérification des données...');
        
        // Vérifier les comptes existants
        const [accounts] = await db.query('SELECT * FROM Account');
        console.log(`📊 Comptes existants: ${accounts.length}`);
        
        // Vérifier les tournois existants
        const [tournaments] = await db.query('SELECT Tournament_Id, name, account_id FROM Tournament');
        console.log(`📊 Tournois existants: ${tournaments.length}`);
        
        // Vérifier les tournois avec account_id invalide
        const [invalidTournaments] = await db.query(`
            SELECT t.Tournament_Id, t.name, t.account_id 
            FROM Tournament t 
            LEFT JOIN Account a ON t.account_id = a.Account_Id 
            WHERE a.Account_Id IS NULL
        `);
        
        console.log(`⚠️  Tournois avec account_id invalide: ${invalidTournaments.length}`);
        
        if (invalidTournaments.length > 0) {
            console.log('🔧 Création d\'un compte admin par défaut...');
            
            // Créer un compte admin par défaut
            const defaultPassword = await bcrypt.hash('admin123', 10);
            
            await db.query(`
                INSERT IGNORE INTO Account (Account_Id, username, password, is_admin) 
                VALUES (1, 'admin', ?, 1)
            `, [defaultPassword]);
            
            console.log('✅ Compte admin créé (username: admin, password: admin123)');
            
            // Mettre à jour les tournois invalides
            console.log('🔧 Mise à jour des tournois...');
            
            await db.query(`
                UPDATE Tournament 
                SET account_id = 1 
                WHERE account_id IS NULL OR account_id NOT IN (SELECT Account_Id FROM Account)
            `);
            
            console.log('✅ Tournois mis à jour');
        }
        
        // Maintenant essayer d'ajouter la contrainte
        try {
            console.log('🔧 Ajout de la contrainte de clé étrangère...');
            
            await db.query(`
                ALTER TABLE Tournament 
                ADD CONSTRAINT fk_tournament_account 
                FOREIGN KEY (account_id) REFERENCES Account (Account_Id)
            `);
            
            console.log('✅ Contrainte ajoutée avec succès');
            
        } catch (constraintError) {
            if (constraintError.code === 'ER_DUP_KEYNAME') {
                console.log('ℹ️  La contrainte existe déjà');
            } else {
                console.error('❌ Erreur lors de l\'ajout de la contrainte:', constraintError.message);
            }
        }
        
        console.log('🎉 Migration terminée avec succès');
        
    } catch (error) {
        console.error('❌ Erreur durante migration:', error);
    } finally {
        process.exit(0);
    }
}

// Exécuter la migration
migrateData();

const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Chercher d'abord dans la table Account (pour admins)
        const [admins] = await db.query('SELECT * FROM Account WHERE username = ?', [username]);

        if (admins.length > 0) {
            // Authentification admin
            const admin = admins[0];
            const isPasswordValid = await bcrypt.compare(password, admin.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: "Mot de passe incorrect" });
            }

            const token = jwt.sign(
                {
                    id: admin.Account_Id,
                    username: admin.username,
                    isAdmin: true
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            return res.status(200).json({
                user: {
                    id: admin.Account_Id,
                    username: admin.username,
                    isAdmin: true
                },
                token
            });
        } else {
            // Chercher dans la table Referee
            const [referees] = await db.query('SELECT * FROM Referee WHERE last_name = ?', [username]);

            if (referees.length === 0) {
                return res.status(401).json({ message: "Nom d'utilisateur non trouvé" });
            }

            const referee = referees[0];
            // Vérifier si le mot de passe correspond à l'UUID ou au mot de passe haché
            const isUuidValid = password === referee.loginUUID;
            const isPasswordValid = referee.password ? await bcrypt.compare(password, referee.password) : false;

            if (!isUuidValid && !isPasswordValid) {
                return res.status(401).json({ message: "Mot de passe incorrect" });
            }

            const token = generateToken(referee);
            sendUserData(referee, res, token);
        }
    } catch (error) {
        console.error('Erreur lors de la tentative de connexion:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la tentative de connexion",
            error: error.message
        });
    }
};

function generateToken(user) {
    return jwt.sign(
        {
            id: user.Referee_Id,
            username: user.last_name,
            firstName: user.first_name,
            uuid: user.loginUUID
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

function sendUserData(user, res, token) {
    res.status(200).json({
        user: {
            id: user.Referee_Id,
            username: user.last_name,
            firstName: user.first_name,
            uuid: user.loginUUID
        },
        token
    });
}

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Accès non autorisé" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token invalide ou expiré" });
        }
        req.user = user;
        next();
    });
};

exports.verifyAuth = async (req, res) => {
    const { uuid } = req.params;

    try {
        const [users] = await db.query(
            'SELECT r.*, a.username FROM Referee r LEFT JOIN Account a ON r.Referee_Id = a.Referee_Id WHERE r.loginUUID = ?',
            [uuid]
        );

        if (users.length === 0) {
            return res.status(401).json({
                authenticated: false,
                message: "UUID non reconnu"
            });
        }

        const user = users[0];
        const token = generateToken(user);

        res.status(200).json({
            authenticated: true,
            user: {
                id: user.Referee_Id,
                username: user.last_name,
                firstName: user.first_name,
                uuid: user.loginUUID
            },
            token
        });
    } catch (error) {
        console.error('Erreur lors de la vérification d\'authentification:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la vérification",
            error: error.message
        });
    }
};

exports.updatePassword = async (req, res) => {
    const { uuid, currentPassword, newPassword } = req.body;

    if (!uuid || !currentPassword || !newPassword) {
        return res.status(400).json({
            message: "L'UUID, le mot de passe actuel et le nouveau mot de passe sont requis"
        });
    }

    try {
        // Chercher l'arbitre par UUID
        const [referees] = await db.query('SELECT * FROM Referee WHERE loginUUID = ?', [uuid]);

        if (referees.length === 0) {
            return res.status(404).json({ message: "Arbitre non trouvé" });
        }

        const referee = referees[0];
        let isPasswordValid = false;

        // Vérifier si l'arbitre a un mot de passe
        if (referee.password) {
            isPasswordValid = await bcrypt.compare(currentPassword, referee.password);
        } else {
            // Pour les arbitres qui se connectent pour la première fois avec leur UUID
            isPasswordValid = currentPassword === referee.loginUUID;
        }

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Mot de passe actuel incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe directement dans la table Referee
        await db.query(
            'UPDATE Referee SET password = ? WHERE Referee_Id = ?',
            [hashedPassword, referee.Referee_Id]
        );        res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du mot de passe:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la mise à jour du mot de passe",
            error: error.message
        });
    }
};

exports.refereeLogin = async (req, res) => {
    const { loginUUID, password } = req.body;

    if (!loginUUID || !password) {
        return res.status(400).json({ 
            message: "loginUUID et password sont requis" 
        });
    }

    try {
        // Chercher l'arbitre par loginUUID
        const [referees] = await db.query('SELECT * FROM Referee WHERE loginUUID = ?', [loginUUID]);

        if (referees.length === 0) {
            return res.status(401).json({ 
                message: "LoginUUID non trouvé" 
            });
        }

        const referee = referees[0];
        let isPasswordValid = password == referee.password;

        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: "Mot de passe incorrect" 
            });
        }

        // Retourner seulement l'ID de l'arbitre
        return res.status(200).json({
            refereeId: referee.Referee_Id,
            refereeName: `${referee.first_name} ${referee.last_name}`,
            message: "Connexion réussie"
        });

    } catch (error) {
        console.error('Erreur lors de la connexion de l\'arbitre:', error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la connexion",
            error: error.message
        });
    }
};
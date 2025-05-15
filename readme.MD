# 🏉 API de Gestion de Tournois de Rugby

Cette API a été créée avec [Express.js](https://expressjs.com/) pour gérer les données du projet.

## 📁 Structure
```
src/
├── routes/ 
├───→ Définition des routes API
├── controllers/ 
├───→ Fonctions métiers (logique)
├── config/
├───→ Fichiers de configuration
├── app.js → Initialisation
└── server.js → Lancement du serveur
```

## ⚙️ Installation

```bash
git clone https://github.com/ton-utilisateur/projet-api.git
cd projet-api
npm install
```

### 🔑 Variables d'environnement
> Créez un fichier `.env` à la racine du projet et ajoutez les variables d'environnement nécessaires. Si vous ne créez pas ce fichier, le projet utilisera les valeurs par défaut.

```bash
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=nom_de_la_base_de_donnees
DB_USER=utilisateur
DB_PASSWORD=mot_de_passe
```

### 🗄️ Base de données
> Cette API utilise une base de données mySQL. Voici les étapes à suivre pour la configurer :

1. Créez une base de données
2. Importez le fichier `db.sql` dans votre base de données
3. Modifiez le fichier `.env` avec les informations de connexion à votre base de données
4. Installez les dépendances nécessaires pour la connexion à la base de données

```bash
npm i mysql2
```

## ▶️ Lancer le serveur
```bash
npm run dev
```
> Le seveur démarre par défaut sur `http://localhost:3000`

## 🧪 Documentation de l'API
> Consultez l'onglet [wiki](https://github.com/AC-AVIRON-CASTRAIS-RUGBY/api/wiki) pour consulter la liste de tous les endpoints de l'API et les tests associés.

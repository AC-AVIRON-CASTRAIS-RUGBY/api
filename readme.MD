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
```

## ▶️ Lancer le serveur
```bash
npm run dev
```
> Le seveur démarre par défaut sur `http://localhost:3000`

## 🧪 Documentation de l'API
> Consultez l'onglet [wiki](https://github.com/AC-AVIRON-CASTRAIS-RUGBY/api/wiki) pour consulter la liste de tous les endpoints de l'API et les tests associés.

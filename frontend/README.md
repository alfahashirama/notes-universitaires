# Gestion Notes Universitaires - Frontend

Application frontend React pour la gestion des notes universitaires.

## 🚀 Technologies utilisées

- **React 18** - Bibliothèque UI
- **Vite** - Build tool
- **React Router DOM** - Routing
- **Tailwind CSS 3.4.17** - Styling
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Lucide React** - Icônes
- **date-fns** - Manipulation de dates
- **jwt-decode** - Décodage JWT

## 📋 Prérequis

- Node.js 16+ et npm
- Backend API en cours d'exécution sur `http://localhost:3000`

## 🛠️ Installation

1. Cloner le projet
```bash
git clone <url-du-repo>
cd gestion-notes-frontend
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
```

Modifier `.env` si nécessaire :
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Gestion Notes Universitaires
```

4. Lancer le serveur de développement
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📦 Scripts disponibles

- `npm run dev` - Lancer le serveur de développement
- `npm run build` - Créer un build de production
- `npm run preview` - Prévisualiser le build de production
- `npm run lint` - Lancer ESLint

## 🏗️ Structure du projet
```
src/
├── assets/          # Images, fonts, etc.
├── components/      # Composants React
│   ├── common/      # Composants réutilisables
│   ├── layout/      # Layout (Navbar, Sidebar, Footer)
│   └── auth/        # Composants d'authentification
├── pages/           # Pages de l'application
├── services/        # Services API
├── context/         # Context React (AuthContext)
├── hooks/           # Hooks personnalisés
├── utils/           # Utilitaires et helpers
├── App.jsx          # Composant principal
├── main.jsx         # Point d'entrée
└── index.css        # Styles globaux
```

## 🔐 Authentification

L'application utilise JWT pour l'authentification. Les tokens sont stockés dans le localStorage.

### Comptes de test :

- **Admin** : admin@universite.mg / Admin@123
- **Enseignant** : enseignant@universite.mg / Admin@123
- **Étudiant** : etudiant@universite.mg / Admin@123

## 🎨 Thème et personnalisation

Le thème est configurable dans `tailwind.config.js`. Les couleurs principales sont :

- Primary: Blue (#3b82f6)
- Secondary: Green (#22c55e)

## 🔒 Routes protégées

Les routes sont protégées par le composant `PrivateRoute` qui vérifie :
- L'authentification de l'utilisateur
- Les permissions basées sur les rôles

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- Desktop (1024px+)
- Tablette (768px - 1023px)
- Mobile (< 768px)

## 🐛 Débogage

Pour activer les logs de développement, définir `NODE_ENV=development` dans `.env`

## 🚀 Déploiement

1. Créer le build de production
```bash
npm run build
```

2. Les fichiers seront dans le dossier `dist/`

3. Déployer sur votre hébergeur préféré (Vercel, Netlify, etc.)

## 📝 Conventions de code

- Utiliser des composants fonctionnels avec Hooks
- Nommer les fichiers en PascalCase pour les composants
- Utiliser camelCase pour les fonctions et variables
- Commenter le code complexe
- Suivre les conventions Airbnb pour JavaScript

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT

## 👥 Auteurs

Votre équipe de développement

## 📞 Support

Pour toute question : support@exemple.com
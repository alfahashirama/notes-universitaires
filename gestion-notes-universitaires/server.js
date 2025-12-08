require('dotenv').config();
const app = require('./src/app');
const db = require('./src/models');

const PORT = process.env.PORT || 3000;

// Fonction pour démarrer le serveur
const startServer = async () => {
  try {
    // Tester la connexion à la base de données
    await db.sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie avec succès.');

    // Synchroniser les modèles (optionnel en développement)
    // ATTENTION: Ne pas utiliser { force: true } en production !
    // await db.sequelize.sync({ alter: true });
    // console.log('✅ Modèles synchronisés avec la base de données.');

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log('🚀 Serveur démarré avec succès!');
      console.log('='.repeat(60));
      console.log(`📍 URL du serveur: http://localhost:${PORT}`);
      console.log(`📍 API de base: http://localhost:${PORT}/api`);
      console.log(`📍 Health Check: http://localhost:${PORT}/health`);
      console.log(`📍 DB Status: http://localhost:${PORT}/db-status`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log('='.repeat(60) + '\n');
      
      console.log('📚 Endpoints disponibles:');
      console.log(`   - Départements: http://localhost:${PORT}/api/departements`);
      console.log(`   - Étudiants: http://localhost:${PORT}/api/etudiants`);
      console.log(`   - Enseignants: http://localhost:${PORT}/api/enseignants`);
      console.log(`   - Matières: http://localhost:${PORT}/api/matieres`);
      console.log(`   - Notes: http://localhost:${PORT}/api/notes`);
      console.log(`   - Bulletins: http://localhost:${PORT}/api/bulletins`);
      console.log(`   - Années académiques: http://localhost:${PORT}/api/annees-academiques`);
      console.log(`   - Semestres: http://localhost:${PORT}/api/semestres`);
      console.log('\n' + '='.repeat(60) + '\n');
    });

  } catch (error) {
    console.error('❌ Impossible de démarrer le serveur:', error);
    process.exit(1);
  }
};

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
  console.error('❌ Erreur non gérée:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Exception non capturée:', err);
  process.exit(1);
});

// Démarrer le serveur
startServer();

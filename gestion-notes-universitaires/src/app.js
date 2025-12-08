const express = require('express');
const cors = require('cors');
const db = require('./models');

// Importer les middlewares
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

// Importer les routes
const routes = require('./routes');

const app = express();

// Middlewares globaux
app.use(cors({
  origin: '*', // En production, spécifier les origines autorisées
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger personnalisé
app.use(logger);

// Route de santé (health check)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Le serveur fonctionne correctement',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Tester la connexion à la base de données
app.get('/db-status', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.status(200).json({
      success: true,
      message: 'Connexion à la base de données établie',
      database: db.sequelize.config.database,
      dialect: db.sequelize.config.dialect
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Impossible de se connecter à la base de données',
      error: error.message
    });
  }
});

// Routes de l'API
app.use('/api', routes);

// Middleware pour les routes non trouvées (404)
app.use(notFound);

// Middleware de gestion des erreurs (doit être en dernier)
app.use(errorHandler);

module.exports = app;
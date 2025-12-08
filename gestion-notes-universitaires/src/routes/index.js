const express = require('express');
const router = express.Router();

// Importer toutes les routes
const authRoutes = require('./authRoutes');
const departementRoutes = require('./departementRoutes');
const etudiantRoutes = require('./etudiantRoutes');
const enseignantRoutes = require('./enseignantRoutes');
const matiereRoutes = require('./matiereRoutes');
const noteRoutes = require('./noteRoutes');
const bulletinRoutes = require('./bulletinRoutes');
const anneeAcademiqueRoutes = require('./anneeAcademiqueRoutes');
const semestreRoutes = require('./semestreRoutes');

// Importer le middleware d'authentification
const { protect, authorize } = require('../middlewares/auth');

// Route de base pour vérifier que l'API fonctionne
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue sur l\'API de Gestion des Notes Universitaires',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      departements: '/api/departements',
      etudiants: '/api/etudiants',
      enseignants: '/api/enseignants',
      matieres: '/api/matieres',
      notes: '/api/notes',
      bulletins: '/api/bulletins',
      anneesAcademiques: '/api/annees-academiques',
      semestres: '/api/semestres'
    }
  });
});

// Routes d'authentification (publiques)
router.use('/auth', authRoutes);

// Routes protégées - Nécessitent une authentification
router.use('/departements', protect, departementRoutes);
router.use('/etudiants', protect, etudiantRoutes);
router.use('/enseignants', protect, enseignantRoutes);
router.use('/matieres', protect, matiereRoutes);
router.use('/notes', protect, noteRoutes);
router.use('/bulletins', protect, bulletinRoutes);
router.use('/annees-academiques', protect, anneeAcademiqueRoutes);
router.use('/semestres', protect, semestreRoutes);

module.exports = router;
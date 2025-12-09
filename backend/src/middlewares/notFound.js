// Middleware pour gérer les routes non trouvées (404)
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route non trouvée: ${req.method} ${req.originalUrl}`,
    availableRoutes: {
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
};

module.exports = notFound;
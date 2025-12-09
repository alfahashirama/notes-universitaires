const jwt = require('jsonwebtoken');
const { Utilisateur, Departement } = require('../models');

// Protéger les routes (vérifier l'authentification)
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Vérifier si le token est dans les headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Vérifier si le token existe
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé - Token manquant'
      });
    }

    try {
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur depuis la base de données
      const utilisateur = await Utilisateur.findByPk(decoded.id, {
        include: [{
          model: Departement,
          as: 'departement',
          attributes: ['id', 'nom', 'code']
        }]
      });

      if (!utilisateur) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Ajouter l'utilisateur à la requête
      req.utilisateur = utilisateur;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'authentification',
      error: error.message
    });
  }
};

// Autoriser certains rôles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.utilisateur) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié'
      });
    }

    if (!roles.includes(req.utilisateur.role)) {
      return res.status(403).json({
        success: false,
        message: `Le rôle '${req.utilisateur.role}' n'est pas autorisé à accéder à cette ressource`
      });
    }

    next();
  };
};
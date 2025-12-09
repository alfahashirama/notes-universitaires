const { Utilisateur, Departement } = require('../models');
const jwt = require('jsonwebtoken');

// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Inscription d'un utilisateur
exports.register = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      password,
      role,
      departementId
    } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const utilisateurExistant = await Utilisateur.findOne({ where: { email } });

    if (utilisateurExistant) {
      return res.status(409).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Créer l'utilisateur
    const utilisateur = await Utilisateur.create({
      nom,
      prenom,
      email,
      password,
      role: role || 'etudiant',
      departementId
    });

    // Récupérer l'utilisateur avec le département
    const utilisateurComplet = await Utilisateur.findByPk(utilisateur.id, {
      include: [{
        model: Departement,
        as: 'departement',
        attributes: ['id', 'nom', 'code']
      }]
    });

    // Générer le token
    const token = generateToken(utilisateur.id);

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        utilisateur: utilisateurComplet,
        token
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un email et un mot de passe'
      });
    }

    // Trouver l'utilisateur
    const utilisateur = await Utilisateur.findOne({
      where: { email: email.toLowerCase() },
      include: [{
        model: Departement,
        as: 'departement',
        attributes: ['id', 'nom', 'code']
      }]
    });

    if (!utilisateur) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await utilisateur.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Générer le token
    const token = generateToken(utilisateur.id);

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: {
        utilisateur: utilisateur.toJSON(),
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

// Obtenir l'utilisateur connecté
exports.getMe = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.utilisateur.id, {
      include: [{
        model: Departement,
        as: 'departement',
        attributes: ['id', 'nom', 'code']
      }]
    });

    res.status(200).json({
      success: true,
      data: utilisateur
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};

// Mettre à jour le mot de passe
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir l\'ancien et le nouveau mot de passe'
      });
    }

    // Récupérer l'utilisateur avec le mot de passe
    const utilisateur = await Utilisateur.findByPk(req.utilisateur.id);

    // Vérifier l'ancien mot de passe
    const isPasswordValid = await utilisateur.comparePassword(oldPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Ancien mot de passe incorrect'
      });
    }

    // Mettre à jour le mot de passe
    utilisateur.password = newPassword;
    await utilisateur.save();

    // Générer un nouveau token
    const token = generateToken(utilisateur.id);

    res.status(200).json({
      success: true,
      message: 'Mot de passe mis à jour avec succès',
      data: { token }
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du mot de passe',
      error: error.message
    });
  }
};

// Mettre à jour le profil
exports.updateProfile = async (req, res) => {
  try {
    const { nom, prenom, email, departementId } = req.body;

    const utilisateur = await Utilisateur.findByPk(req.utilisateur.id);

    // Mettre à jour les champs autorisés
    if (nom) utilisateur.nom = nom;
    if (prenom) utilisateur.prenom = prenom;
    if (email) utilisateur.email = email;
    if (departementId) utilisateur.departementId = departementId;

    await utilisateur.save();

    const utilisateurMisAJour = await Utilisateur.findByPk(utilisateur.id, {
      include: [{
        model: Departement,
        as: 'departement',
        attributes: ['id', 'nom', 'code']
      }]
    });

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: utilisateurMisAJour
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: error.errors.map(e => e.message)
      });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil',
      error: error.message
    });
  }
};

// Obtenir tous les utilisateurs (Admin seulement)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, departementId } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (role) whereClause.role = role;
    if (departementId) whereClause.departementId = departementId;

    const { count, rows: utilisateurs } = await Utilisateur.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['nom', 'ASC']],
      include: [{
        model: Departement,
        as: 'departement',
        attributes: ['id', 'nom', 'code']
      }]
    });

    res.status(200).json({
      success: true,
      data: utilisateurs,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message
    });
  }
};

// Supprimer un utilisateur (Admin seulement)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const utilisateur = await Utilisateur.findByPk(id);

    if (!utilisateur) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Empêcher la suppression de son propre compte
    if (utilisateur.id === req.utilisateur.id) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }

    await utilisateur.destroy();

    res.status(200).json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
};
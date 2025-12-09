const { Etudiant, Departement, Note, Matiere } = require('../models');
const { Op } = require('sequelize');

// Créer un étudiant
exports.create = async (req, res) => {
  try {
    const {
      matricule,
      nom,
      prenom,
      dateNaissance,
      lieuNaissance,
      email,
      telephone,
      adresse,
      niveau,
      departementId
    } = req.body;

    const etudiant = await Etudiant.create({
      matricule,
      nom,
      prenom,
      dateNaissance,
      lieuNaissance,
      email,
      telephone,
      adresse,
      niveau,
      departementId
    });

    // Récupérer l'étudiant avec le département
    const etudiantAvecDept = await Etudiant.findByPk(etudiant.id, {
      include: [{
        model: Departement,
        as: 'departement',
        attributes: ['id', 'nom', 'code']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Étudiant créé avec succès',
      data: etudiantAvecDept
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
        message: 'Ce matricule ou cet email existe déjà'
      });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Le département spécifié n\'existe pas'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'étudiant',
      error: error.message
    });
  }
};

// Obtenir tous les étudiants
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, niveau, departementId } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};

    // Recherche
    if (search) {
      whereClause[Op.or] = [
        { nom: { [Op.iLike]: `%${search}%` } },
        { prenom: { [Op.iLike]: `%${search}%` } },
        { matricule: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filtrer par niveau
    if (niveau) {
      whereClause.niveau = niveau;
    }

    // Filtrer par département
    if (departementId) {
      whereClause.departementId = departementId;
    }

    const { count, rows: etudiants } = await Etudiant.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['nom', 'ASC'], ['prenom', 'ASC']],
      include: [{
        model: Departement,
        as: 'departement',
        attributes: ['id', 'nom', 'code']
      }]
    });

    res.status(200).json({
      success: true,
      data: etudiants,
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
      message: 'Erreur lors de la récupération des étudiants',
      error: error.message
    });
  }
};

// Obtenir un étudiant par ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const etudiant = await Etudiant.findByPk(id, {
      include: [
        {
          model: Departement,
          as: 'departement',
          attributes: ['id', 'nom', 'code']
        },
        {
          model: Note,
          as: 'notes',
          include: [{
            model: Matiere,
            as: 'matiere',
            attributes: ['id', 'code', 'nom', 'coefficient']
          }]
        }
      ]
    });

    if (!etudiant) {
      return res.status(404).json({
        success: false,
        message: 'Étudiant non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: etudiant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'étudiant',
      error: error.message
    });
  }
};

// Mettre à jour un étudiant
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const etudiant = await Etudiant.findByPk(id);

    if (!etudiant) {
      return res.status(404).json({
        success: false,
        message: 'Étudiant non trouvé'
      });
    }

    await etudiant.update(updateData);

    // Récupérer l'étudiant mis à jour avec le département
    const etudiantMisAJour = await Etudiant.findByPk(id, {
      include: [{
        model: Departement,
        as: 'departement',
        attributes: ['id', 'nom', 'code']
      }]
    });

    res.status(200).json({
      success: true,
      message: 'Étudiant mis à jour avec succès',
      data: etudiantMisAJour
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
      message: 'Erreur lors de la mise à jour de l\'étudiant',
      error: error.message
    });
  }
};

// Supprimer un étudiant
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const etudiant = await Etudiant.findByPk(id);

    if (!etudiant) {
      return res.status(404).json({
        success: false,
        message: 'Étudiant non trouvé'
      });
    }

    await etudiant.destroy();

    res.status(200).json({
      success: true,
      message: 'Étudiant supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'étudiant',
      error: error.message
    });
  }
};

// Obtenir les notes d'un étudiant
exports.getNotes = async (req, res) => {
  try {
    const { id } = req.params;

    const etudiant = await Etudiant.findByPk(id, {
      include: [{
        model: Note,
        as: 'notes',
        include: [{
          model: Matiere,
          as: 'matiere',
          attributes: ['id', 'code', 'nom', 'coefficient', 'creditECTS']
        }],
        order: [['createdAt', 'DESC']]
      }]
    });

    if (!etudiant) {
      return res.status(404).json({
        success: false,
        message: 'Étudiant non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        etudiant: {
          id: etudiant.id,
          matricule: etudiant.matricule,
          nomComplet: etudiant.nomComplet
        },
        notes: etudiant.notes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notes',
      error: error.message
    });
  }
};
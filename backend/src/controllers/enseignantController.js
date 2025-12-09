const { Enseignant, Departement, Matiere } = require('../models');
const { Op } = require('sequelize');

// Créer un enseignant
exports.create = async (req, res) => {
  try {
    const {
      matricule,
      nom,
      prenom,
      email,
      telephone,
      specialite,
      departementId
    } = req.body;

    const enseignant = await Enseignant.create({
      matricule,
      nom,
      prenom,
      email,
      telephone,
      specialite,
      departementId
    });

    const enseignantAvecDept = await Enseignant.findByPk(enseignant.id, {
      include: [{
        model: Departement,
        as: 'departement',
        attributes: ['id', 'nom', 'code']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Enseignant créé avec succès',
      data: enseignantAvecDept
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
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'enseignant',
      error: error.message
    });
  }
};

// Obtenir tous les enseignants
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, departementId } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { nom: { [Op.iLike]: `%${search}%` } },
        { prenom: { [Op.iLike]: `%${search}%` } },
        { matricule: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (departementId) {
      whereClause.departementId = departementId;
    }

    const { count, rows: enseignants } = await Enseignant.findAndCountAll({
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
      data: enseignants,
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
      message: 'Erreur lors de la récupération des enseignants',
      error: error.message
    });
  }
};

// Obtenir un enseignant par ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const enseignant = await Enseignant.findByPk(id, {
      include: [
        {
          model: Departement,
          as: 'departement',
          attributes: ['id', 'nom', 'code']
        },
        {
          model: Matiere,
          as: 'matieres',
          attributes: ['id', 'code', 'nom', 'coefficient']
        }
      ]
    });

    if (!enseignant) {
      return res.status(404).json({
        success: false,
        message: 'Enseignant non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: enseignant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'enseignant',
      error: error.message
    });
  }
};

// Mettre à jour un enseignant
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const enseignant = await Enseignant.findByPk(id);

    if (!enseignant) {
      return res.status(404).json({
        success: false,
        message: 'Enseignant non trouvé'
      });
    }

    await enseignant.update(updateData);

    const enseignantMisAJour = await Enseignant.findByPk(id, {
      include: [{
        model: Departement,
        as: 'departement',
        attributes: ['id', 'nom', 'code']
      }]
    });

    res.status(200).json({
      success: true,
      message: 'Enseignant mis à jour avec succès',
      data: enseignantMisAJour
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
      message: 'Erreur lors de la mise à jour de l\'enseignant',
      error: error.message
    });
  }
};

// Supprimer un enseignant
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const enseignant = await Enseignant.findByPk(id);

    if (!enseignant) {
      return res.status(404).json({
        success: false,
        message: 'Enseignant non trouvé'
      });
    }

    await enseignant.destroy();

    res.status(200).json({
      success: true,
      message: 'Enseignant supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'enseignant',
      error: error.message
    });
  }
};

// Obtenir les matières d'un enseignant
exports.getMatieres = async (req, res) => {
  try {
    const { id } = req.params;

    const enseignant = await Enseignant.findByPk(id, {
      include: [{
        model: Matiere,
        as: 'matieres',
        attributes: ['id', 'code', 'nom', 'coefficient', 'creditECTS']
      }]
    });

    if (!enseignant) {
      return res.status(404).json({
        success: false,
        message: 'Enseignant non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        enseignant: {
          id: enseignant.id,
          matricule: enseignant.matricule,
          nomComplet: enseignant.nomComplet
        },
        matieres: enseignant.matieres
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des matières',
      error: error.message
    });
  }
};
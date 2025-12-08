const { AnneeAcademique, Semestre } = require('../models');
const { Op } = require('sequelize');

// Créer une année académique
exports.create = async (req, res) => {
  try {
    const { libelle, dateDebut, dateFin, estActive } = req.body;

    const anneeAcademique = await AnneeAcademique.create({
      libelle,
      dateDebut,
      dateFin,
      estActive: estActive || false
    });

    res.status(201).json({
      success: true,
      message: 'Année académique créée avec succès',
      data: anneeAcademique
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
        message: 'Cette année académique existe déjà'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'année académique',
      error: error.message
    });
  }
};

// Obtenir toutes les années académiques
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, estActive } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (estActive !== undefined) {
      whereClause.estActive = estActive === 'true';
    }

    const { count, rows: anneesAcademiques } = await AnneeAcademique.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['dateDebut', 'DESC']],
      include: [{
        model: Semestre,
        as: 'semestres',
        attributes: ['id', 'nom', 'numero']
      }]
    });

    res.status(200).json({
      success: true,
      data: anneesAcademiques,
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
      message: 'Erreur lors de la récupération des années académiques',
      error: error.message
    });
  }
};

// Obtenir l'année académique active
exports.getActive = async (req, res) => {
  try {
    const anneeActive = await AnneeAcademique.findOne({
      where: { estActive: true },
      include: [{
        model: Semestre,
        as: 'semestres',
        attributes: ['id', 'nom', 'numero']
      }]
    });

    if (!anneeActive) {
      return res.status(404).json({
        success: false,
        message: 'Aucune année académique active'
      });
    }

    res.status(200).json({
      success: true,
      data: anneeActive
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'année active',
      error: error.message
    });
  }
};

// Obtenir une année académique par ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const anneeAcademique = await AnneeAcademique.findByPk(id, {
      include: [{
        model: Semestre,
        as: 'semestres',
        attributes: ['id', 'nom', 'numero']
      }]
    });

    if (!anneeAcademique) {
      return res.status(404).json({
        success: false,
        message: 'Année académique non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: anneeAcademique
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'année académique',
      error: error.message
    });
  }
};

// Mettre à jour une année académique
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const anneeAcademique = await AnneeAcademique.findByPk(id);

    if (!anneeAcademique) {
      return res.status(404).json({
        success: false,
        message: 'Année académique non trouvée'
      });
    }

    await anneeAcademique.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Année académique mise à jour avec succès',
      data: anneeAcademique
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
      message: 'Erreur lors de la mise à jour',
      error: error.message
    });
  }
};

// Supprimer une année académique
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const anneeAcademique = await AnneeAcademique.findByPk(id);

    if (!anneeAcademique) {
      return res.status(404).json({
        success: false,
        message: 'Année académique non trouvée'
      });
    }

    // Vérifier s'il y a des semestres associés
    const semestresCount = await Semestre.count({ where: { anneeAcademiqueId: id } });

    if (semestresCount > 0) {
      return res.status(409).json({
        success: false,
        message: `Impossible de supprimer cette année car elle contient ${semestresCount} semestre(s)`
      });
    }

    await anneeAcademique.destroy();

    res.status(200).json({
      success: true,
      message: 'Année académique supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
};
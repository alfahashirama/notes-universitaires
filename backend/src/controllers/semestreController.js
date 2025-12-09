const { Semestre, AnneeAcademique, Matiere } = require('../models');
const { Op } = require('sequelize');

// Créer un semestre
exports.create = async (req, res) => {
  try {
    const { nom, numero, anneeAcademiqueId } = req.body;

    const semestre = await Semestre.create({
      nom,
      numero,
      anneeAcademiqueId
    });

    const semestreComplet = await Semestre.findByPk(semestre.id, {
      include: [{
        model: AnneeAcademique,
        as: 'anneeAcademique',
        attributes: ['id', 'libelle', 'estActive']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Semestre créé avec succès',
      data: semestreComplet
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
        message: 'Ce semestre existe déjà pour cette année académique'
      });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'L\'année académique spécifiée n\'existe pas'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du semestre',
      error: error.message
    });
  }
};

// Obtenir tous les semestres
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, anneeAcademiqueId } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (anneeAcademiqueId) {
      whereClause.anneeAcademiqueId = anneeAcademiqueId;
    }

    const { count, rows: semestres } = await Semestre.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['numero', 'ASC']],
      include: [{
        model: AnneeAcademique,
        as: 'anneeAcademique',
        attributes: ['id', 'libelle', 'estActive']
      }]
    });

    res.status(200).json({
      success: true,
      data: semestres,
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
      message: 'Erreur lors de la récupération des semestres',
      error: error.message
    });
  }
};

// Obtenir un semestre par ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const semestre = await Semestre.findByPk(id, {
      include: [
        {
          model: AnneeAcademique,
          as: 'anneeAcademique',
          attributes: ['id', 'libelle', 'estActive']
        },
        {
          model: Matiere,
          as: 'matieres',
          attributes: ['id', 'code', 'nom', 'coefficient', 'creditECTS']
        }
      ]
    });

    if (!semestre) {
      return res.status(404).json({
        success: false,
        message: 'Semestre non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: semestre
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du semestre',
      error: error.message
    });
  }
};

// Mettre à jour un semestre
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const semestre = await Semestre.findByPk(id);

    if (!semestre) {
      return res.status(404).json({
        success: false,
        message: 'Semestre non trouvé'
      });
    }

    await semestre.update(updateData);

    const semestreComplet = await Semestre.findByPk(id, {
      include: [{
        model: AnneeAcademique,
        as: 'anneeAcademique',
        attributes: ['id', 'libelle']
      }]
    });

    res.status(200).json({
      success: true,
      message: 'Semestre mis à jour avec succès',
      data: semestreComplet
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

// Supprimer un semestre
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const semestre = await Semestre.findByPk(id);

    if (!semestre) {
      return res.status(404).json({
        success: false,
        message: 'Semestre non trouvé'
      });
    }

    // Vérifier s'il y a des matières associées
    const matieresCount = await Matiere.count({ where: { semestreId: id } });

    if (matieresCount > 0) {
      return res.status(409).json({
        success: false,
        message: `Impossible de supprimer ce semestre car il contient ${matieresCount} matière(s)`
      });
    }

    await semestre.destroy();

    res.status(200).json({
      success: true,
      message: 'Semestre supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
};
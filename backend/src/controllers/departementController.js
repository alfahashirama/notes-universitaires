const { Departement, Etudiant, Enseignant } = require('../models');
const { Op } = require('sequelize');

// Créer un département
exports.create = async (req, res) => {
  try {
    const { nom, code, description } = req.body;

    const departement = await Departement.create({
      nom,
      code,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Département créé avec succès',
      data: departement
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
        message: 'Ce code de département existe déjà'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du département',
      error: error.message
    });
  }
};

// Obtenir tous les départements
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = search ? {
      [Op.or]: [
        { nom: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } }
      ]
    } : {};

    const { count, rows: departements } = await Departement.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['nom', 'ASC']],
      include: [
        {
          model: Etudiant,
          as: 'etudiants',
          attributes: ['id', 'matricule', 'nom', 'prenom']
        },
        {
          model: Enseignant,
          as: 'enseignants',
          attributes: ['id', 'matricule', 'nom', 'prenom']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: departements,
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
      message: 'Erreur lors de la récupération des départements',
      error: error.message
    });
  }
};

// Obtenir un département par ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const departement = await Departement.findByPk(id, {
      include: [
        {
          model: Etudiant,
          as: 'etudiants',
          attributes: ['id', 'matricule', 'nom', 'prenom', 'email', 'niveau']
        },
        {
          model: Enseignant,
          as: 'enseignants',
          attributes: ['id', 'matricule', 'nom', 'prenom', 'email', 'specialite']
        }
      ]
    });

    if (!departement) {
      return res.status(404).json({
        success: false,
        message: 'Département non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: departement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du département',
      error: error.message
    });
  }
};

// Mettre à jour un département
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, code, description } = req.body;

    const departement = await Departement.findByPk(id);

    if (!departement) {
      return res.status(404).json({
        success: false,
        message: 'Département non trouvé'
      });
    }

    await departement.update({
      nom: nom || departement.nom,
      code: code || departement.code,
      description: description !== undefined ? description : departement.description
    });

    res.status(200).json({
      success: true,
      message: 'Département mis à jour avec succès',
      data: departement
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
      message: 'Erreur lors de la mise à jour du département',
      error: error.message
    });
  }
};

// Supprimer un département
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const departement = await Departement.findByPk(id);

    if (!departement) {
      return res.status(404).json({
        success: false,
        message: 'Département non trouvé'
      });
    }

    // Vérifier s'il y a des étudiants ou enseignants associés
    const etudiantsCount = await Etudiant.count({ where: { departementId: id } });
    const enseignantsCount = await Enseignant.count({ where: { departementId: id } });

    if (etudiantsCount > 0 || enseignantsCount > 0) {
      return res.status(409).json({
        success: false,
        message: 'Impossible de supprimer ce département car il contient des étudiants ou des enseignants',
        data: {
          etudiantsCount,
          enseignantsCount
        }
      });
    }

    await departement.destroy();

    res.status(200).json({
      success: true,
      message: 'Département supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du département',
      error: error.message
    });
  }
};

// Obtenir les statistiques d'un département
exports.getStatistics = async (req, res) => {
  try {
    const { id } = req.params;

    const departement = await Departement.findByPk(id);

    if (!departement) {
      return res.status(404).json({
        success: false,
        message: 'Département non trouvé'
      });
    }

    const totalEtudiants = await Etudiant.count({ where: { departementId: id } });
    const totalEnseignants = await Enseignant.count({ where: { departementId: id } });

    // Répartition par niveau
    const etudiantsParNiveau = await Etudiant.findAll({
      where: { departementId: id },
      attributes: [
        'niveau',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['niveau'],
      raw: true
    });

    res.status(200).json({
      success: true,
      data: {
        departement: {
          id: departement.id,
          nom: departement.nom,
          code: departement.code
        },
        statistiques: {
          totalEtudiants,
          totalEnseignants,
          etudiantsParNiveau
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};
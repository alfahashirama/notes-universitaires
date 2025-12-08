const { Matiere, Semestre, Enseignant, AnneeAcademique, Note } = require('../models');
const { Op } = require('sequelize');

// Créer une matière
exports.create = async (req, res) => {
  try {
    const {
      code,
      nom,
      coefficient,
      creditECTS,
      semestreId,
      enseignantId
    } = req.body;

    const matiere = await Matiere.create({
      code,
      nom,
      coefficient,
      creditECTS,
      semestreId,
      enseignantId
    });

    const matiereComplete = await Matiere.findByPk(matiere.id, {
      include: [
        {
          model: Semestre,
          as: 'semestre',
          attributes: ['id', 'nom', 'numero'],
          include: [{
            model: AnneeAcademique,
            as: 'anneeAcademique',
            attributes: ['id', 'libelle']
          }]
        },
        {
          model: Enseignant,
          as: 'enseignant',
          attributes: ['id', 'matricule', 'nom', 'prenom']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Matière créée avec succès',
      data: matiereComplete
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
        message: 'Ce code de matière existe déjà'
      });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Le semestre ou l\'enseignant spécifié n\'existe pas'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la matière',
      error: error.message
    });
  }
};

// Obtenir toutes les matières
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, semestreId, enseignantId } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { nom: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (semestreId) {
      whereClause.semestreId = semestreId;
    }

    if (enseignantId) {
      whereClause.enseignantId = enseignantId;
    }

    const { count, rows: matieres } = await Matiere.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['nom', 'ASC']],
      include: [
        {
          model: Semestre,
          as: 'semestre',
          attributes: ['id', 'nom', 'numero'],
          include: [{
            model: AnneeAcademique,
            as: 'anneeAcademique',
            attributes: ['id', 'libelle']
          }]
        },
        {
          model: Enseignant,
          as: 'enseignant',
          attributes: ['id', 'matricule', 'nom', 'prenom', 'email']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: matieres,
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
      message: 'Erreur lors de la récupération des matières',
      error: error.message
    });
  }
};

// Obtenir une matière par ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const matiere = await Matiere.findByPk(id, {
      include: [
        {
          model: Semestre,
          as: 'semestre',
          attributes: ['id', 'nom', 'numero'],
          include: [{
            model: AnneeAcademique,
            as: 'anneeAcademique',
            attributes: ['id', 'libelle']
          }]
        },
        {
          model: Enseignant,
          as: 'enseignant',
          attributes: ['id', 'matricule', 'nom', 'prenom', 'email', 'specialite']
        }
      ]
    });

    if (!matiere) {
      return res.status(404).json({
        success: false,
        message: 'Matière non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: matiere
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la matière',
      error: error.message
    });
  }
};

// Mettre à jour une matière
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const matiere = await Matiere.findByPk(id);

    if (!matiere) {
      return res.status(404).json({
        success: false,
        message: 'Matière non trouvée'
      });
    }

    await matiere.update(updateData);

    const matiereComplete = await Matiere.findByPk(id, {
      include: [
        {
          model: Semestre,
          as: 'semestre',
          attributes: ['id', 'nom', 'numero']
        },
        {
          model: Enseignant,
          as: 'enseignant',
          attributes: ['id', 'matricule', 'nom', 'prenom']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Matière mise à jour avec succès',
      data: matiereComplete
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
      message: 'Erreur lors de la mise à jour de la matière',
      error: error.message
    });
  }
};

// Supprimer une matière
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const matiere = await Matiere.findByPk(id);

    if (!matiere) {
      return res.status(404).json({
        success: false,
        message: 'Matière non trouvée'
      });
    }

    // Vérifier s'il y a des notes associées
    const notesCount = await Note.count({ where: { matiereId: id } });

    if (notesCount > 0) {
      return res.status(409).json({
        success: false,
        message: `Impossible de supprimer cette matière car elle a ${notesCount} note(s) associée(s)`,
        data: { notesCount }
      });
    }

    await matiere.destroy();

    res.status(200).json({
      success: true,
      message: 'Matière supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la matière',
      error: error.message
    });
  }
};

// Obtenir les statistiques d'une matière
exports.getStatistics = async (req, res) => {
  try {
    const { id } = req.params;

    const matiere = await Matiere.findByPk(id, {
      include: [{
        model: Note,
        as: 'notes',
        attributes: ['valeur']
      }]
    });

    if (!matiere) {
      return res.status(404).json({
        success: false,
        message: 'Matière non trouvée'
      });
    }

    const notes = matiere.notes.map(n => parseFloat(n.valeur));
    const totalNotes = notes.length;

    if (totalNotes === 0) {
      return res.status(200).json({
        success: true,
        data: {
          matiere: {
            id: matiere.id,
            code: matiere.code,
            nom: matiere.nom
          },
          statistiques: {
            totalNotes: 0,
            message: 'Aucune note disponible pour cette matière'
          }
        }
      });
    }

    const moyenne = notes.reduce((acc, val) => acc + val, 0) / totalNotes;
    const noteMin = Math.min(...notes);
    const noteMax = Math.max(...notes);
    const etudiantsAdmis = notes.filter(n => n >= 10).length;
    const tauxReussite = (etudiantsAdmis / totalNotes) * 100;

    res.status(200).json({
      success: true,
      data: {
        matiere: {
          id: matiere.id,
          code: matiere.code,
          nom: matiere.nom,
          coefficient: matiere.coefficient
        },
        statistiques: {
          totalNotes,
          moyenne: moyenne.toFixed(2),
          noteMin: noteMin.toFixed(2),
          noteMax: noteMax.toFixed(2),
          etudiantsAdmis,
          etudiantsAjournes: totalNotes - etudiantsAdmis,
          tauxReussite: tauxReussite.toFixed(2) + '%'
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
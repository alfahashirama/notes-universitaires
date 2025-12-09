const { Note, Etudiant, Matiere, Semestre, Departement } = require('../models');
const { Op } = require('sequelize');

// Créer une note
exports.create = async (req, res) => {
  try {
    const {
      valeur,
      session,
      typeEvaluation,
      etudiantId,
      matiereId
    } = req.body;

    // Vérifier si l'étudiant et la matière existent
    const etudiant = await Etudiant.findByPk(etudiantId);
    const matiere = await Matiere.findByPk(matiereId);

    if (!etudiant) {
      return res.status(404).json({
        success: false,
        message: 'Étudiant non trouvé'
      });
    }

    if (!matiere) {
      return res.status(404).json({
        success: false,
        message: 'Matière non trouvée'
      });
    }

    // Vérifier si une note existe déjà pour cet étudiant, cette matière, ce type et cette session
    const noteExistante = await Note.findOne({
      where: {
        etudiantId,
        matiereId,
        typeEvaluation,
        session
      }
    });

    if (noteExistante) {
      return res.status(409).json({
        success: false,
        message: 'Une note existe déjà pour cet étudiant, cette matière, ce type d\'évaluation et cette session'
      });
    }

    const note = await Note.create({
      valeur,
      session,
      typeEvaluation,
      etudiantId,
      matiereId
    });

    const noteComplete = await Note.findByPk(note.id, {
      include: [
        {
          model: Etudiant,
          as: 'etudiant',
          attributes: ['id', 'matricule', 'nom', 'prenom']
        },
        {
          model: Matiere,
          as: 'matiere',
          attributes: ['id', 'code', 'nom', 'coefficient']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Note créée avec succès',
      data: noteComplete
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: error.errors.map(e => e.message)
      });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'L\'étudiant ou la matière spécifié n\'existe pas'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la note',
      error: error.message
    });
  }
};

// Obtenir toutes les notes
exports.getAll = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      etudiantId, 
      matiereId, 
      session, 
      typeEvaluation 
    } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};

    if (etudiantId) whereClause.etudiantId = etudiantId;
    if (matiereId) whereClause.matiereId = matiereId;
    if (session) whereClause.session = session;
    if (typeEvaluation) whereClause.typeEvaluation = typeEvaluation;

    const { count, rows: notes } = await Note.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Etudiant,
          as: 'etudiant',
          attributes: ['id', 'matricule', 'nom', 'prenom']
        },
        {
          model: Matiere,
          as: 'matiere',
          attributes: ['id', 'code', 'nom', 'coefficient']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: notes,
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
      message: 'Erreur lors de la récupération des notes',
      error: error.message
    });
  }
};

// Obtenir une note par ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findByPk(id, {
      include: [
        {
          model: Etudiant,
          as: 'etudiant',
          attributes: ['id', 'matricule', 'nom', 'prenom', 'email']
        },
        {
          model: Matiere,
          as: 'matiere',
          attributes: ['id', 'code', 'nom', 'coefficient', 'creditECTS']
        }
      ]
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la note',
      error: error.message
    });
  }
};

// Mettre à jour une note
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { valeur, session, typeEvaluation } = req.body;

    const note = await Note.findByPk(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note non trouvée'
      });
    }

    await note.update({
      valeur: valeur !== undefined ? valeur : note.valeur,
      session: session || note.session,
      typeEvaluation: typeEvaluation || note.typeEvaluation
    });

    const noteComplete = await Note.findByPk(id, {
      include: [
        {
          model: Etudiant,
          as: 'etudiant',
          attributes: ['id', 'matricule', 'nom', 'prenom']
        },
        {
          model: Matiere,
          as: 'matiere',
          attributes: ['id', 'code', 'nom', 'coefficient']
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Note mise à jour avec succès',
      data: noteComplete
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
      message: 'Erreur lors de la mise à jour de la note',
      error: error.message
    });
  }
};

// Supprimer une note
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findByPk(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note non trouvée'
      });
    }

    await note.destroy();

    res.status(200).json({
      success: true,
      message: 'Note supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la note',
      error: error.message
    });
  }
};

// Créer plusieurs notes en une seule fois
exports.createBulk = async (req, res) => {
  try {
    const { notes } = req.body; // Tableau de notes

    if (!Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un tableau de notes'
      });
    }

    const notesCreees = await Note.bulkCreate(notes, {
      validate: true,
      ignoreDuplicates: false
    });

    res.status(201).json({
      success: true,
      message: `${notesCreees.length} note(s) créée(s) avec succès`,
      data: notesCreees
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
      message: 'Erreur lors de la création des notes',
      error: error.message
    });
  }
};
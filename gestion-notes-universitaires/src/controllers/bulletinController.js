const { Etudiant, Note, Matiere, Semestre, AnneeAcademique, Departement } = require('../models');
const { Op } = require('sequelize');

// Générer le bulletin d'un étudiant pour un semestre
exports.getBulletinEtudiant = async (req, res) => {
  try {
    const { etudiantId, semestreId } = req.params;

    // Récupérer l'étudiant
    const etudiant = await Etudiant.findByPk(etudiantId, {
      include: [{
        model: Departement,
        as: 'departement',
        attributes: ['id', 'nom', 'code']
      }]
    });

    if (!etudiant) {
      return res.status(404).json({
        success: false,
        message: 'Étudiant non trouvé'
      });
    }

    // Récupérer le semestre
    const semestre = await Semestre.findByPk(semestreId, {
      include: [{
        model: AnneeAcademique,
        as: 'anneeAcademique',
        attributes: ['id', 'libelle']
      }]
    });

    if (!semestre) {
      return res.status(404).json({
        success: false,
        message: 'Semestre non trouvé'
      });
    }

    // Récupérer toutes les matières du semestre
    const matieres = await Matiere.findAll({
      where: { semestreId },
      include: [{
        model: Note,
        as: 'notes',
        where: { etudiantId },
        required: false
      }]
    });

    // Calculer les statistiques
    let totalCoefficient = 0;
    let sommeNotesPonderees = 0;
    let totalCredits = 0;
    let creditsObtenus = 0;

    const resultatsParMatiere = matieres.map(matiere => {
      const notesMatiere = matiere.notes;
      
      // Calculer la moyenne de la matière (si plusieurs notes)
      let moyenneMatiere = null;
      if (notesMatiere.length > 0) {
        const sommeNotes = notesMatiere.reduce((acc, note) => acc + parseFloat(note.valeur), 0);
        moyenneMatiere = sommeNotes / notesMatiere.length;
        
        // Ajouter au calcul de la moyenne générale
        totalCoefficient += matiere.coefficient;
        sommeNotesPonderees += moyenneMatiere * matiere.coefficient;
        totalCredits += matiere.creditECTS;
        
        if (moyenneMatiere >= 10) {
          creditsObtenus += matiere.creditECTS;
        }
      }

      return {
        matiere: {
          id: matiere.id,
          code: matiere.code,
          nom: matiere.nom,
          coefficient: matiere.coefficient,
          creditECTS: matiere.creditECTS
        },
        notes: notesMatiere.map(n => ({
          valeur: parseFloat(n.valeur),
          typeEvaluation: n.typeEvaluation,
          session: n.session
        })),
        moyenne: moyenneMatiere ? moyenneMatiere.toFixed(2) : 'N/A',
        estValide: moyenneMatiere ? moyenneMatiere >= 10 : false
      };
    });

    // Calculer la moyenne générale
    const moyenneGenerale = totalCoefficient > 0 
      ? (sommeNotesPonderees / totalCoefficient).toFixed(2)
      : null;

    // Déterminer la mention
    let mention = 'Ajourné';
    if (moyenneGenerale && parseFloat(moyenneGenerale) >= 10) {
      if (parseFloat(moyenneGenerale) < 12) mention = 'Passable';
      else if (parseFloat(moyenneGenerale) < 14) mention = 'Assez Bien';
      else if (parseFloat(moyenneGenerale) < 16) mention = 'Bien';
      else if (parseFloat(moyenneGenerale) < 18) mention = 'Très Bien';
      else mention = 'Excellent';
    }

    res.status(200).json({
      success: true,
      data: {
        etudiant: {
          id: etudiant.id,
          matricule: etudiant.matricule,
          nomComplet: etudiant.nomComplet,
          niveau: etudiant.niveau,
          departement: etudiant.departement
        },
        semestre: {
          id: semestre.id,
          nom: semestre.nom,
          numero: semestre.numero,
          anneeAcademique: semestre.anneeAcademique
        },
        resultats: resultatsParMatiere,
        statistiques: {
          moyenneGenerale,
          mention,
          totalCredits,
          creditsObtenus,
          tauxReussite: totalCredits > 0 ? ((creditsObtenus / totalCredits) * 100).toFixed(2) + '%' : 'N/A'
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du bulletin',
      error: error.message
    });
  }
};

// Obtenir le classement des étudiants pour un semestre
exports.getClassementSemestre = async (req, res) => {
  try {
    const { semestreId } = req.params;
    const { departementId, niveau } = req.query;

    // Vérifier que le semestre existe
    const semestre = await Semestre.findByPk(semestreId);
    if (!semestre) {
      return res.status(404).json({
        success: false,
        message: 'Semestre non trouvé'
      });
    }

    // Construire la clause where pour les étudiants
    let whereEtudiant = {};
    if (departementId) whereEtudiant.departementId = departementId;
    if (niveau) whereEtudiant.niveau = niveau;

    // Récupérer tous les étudiants avec leurs notes
    const etudiants = await Etudiant.findAll({
      where: whereEtudiant,
      include: [
        {
          model: Departement,
          as: 'departement',
          attributes: ['nom', 'code']
        },
        {
          model: Note,
          as: 'notes',
          required: false,
          include: [{
            model: Matiere,
            as: 'matiere',
            where: { semestreId },
            attributes: ['id', 'code', 'nom', 'coefficient']
          }]
        }
      ]
    });

    // Calculer la moyenne de chaque étudiant
    const classement = etudiants.map(etudiant => {
      const notes = etudiant.notes;
      
      if (notes.length === 0) {
        return {
          etudiant: {
            id: etudiant.id,
            matricule: etudiant.matricule,
            nomComplet: etudiant.nomComplet,
            niveau: etudiant.niveau,
            departement: etudiant.departement
          },
          moyenne: null,
          totalNotes: 0
        };
      }

      // Grouper les notes par matière et calculer la moyenne de chaque matière
      const notesParMatiere = {};
      notes.forEach(note => {
        const matiereId = note.matiere.id;
        if (!notesParMatiere[matiereId]) {
          notesParMatiere[matiereId] = {
            coefficient: note.matiere.coefficient,
            notes: []
          };
        }
        notesParMatiere[matiereId].notes.push(parseFloat(note.valeur));
      });

      // Calculer la moyenne générale
      let totalCoefficient = 0;
      let sommeNotesPonderees = 0;

      Object.values(notesParMatiere).forEach(({ coefficient, notes }) => {
        const moyenneMatiere = notes.reduce((acc, val) => acc + val, 0) / notes.length;
        totalCoefficient += coefficient;
        sommeNotesPonderees += moyenneMatiere * coefficient;
      });

      const moyenne = totalCoefficient > 0 
        ? (sommeNotesPonderees / totalCoefficient).toFixed(2)
        : null;

      return {
        etudiant: {
          id: etudiant.id,
          matricule: etudiant.matricule,
          nomComplet: etudiant.nomComplet,
          niveau: etudiant.niveau,
          departement: etudiant.departement
        },
        moyenne: moyenne ? parseFloat(moyenne) : null,
        totalNotes: notes.length
      };
    });

    // Trier par moyenne décroissante
    classement.sort((a, b) => {
      if (a.moyenne === null) return 1;
      if (b.moyenne === null) return -1;
      return b.moyenne - a.moyenne;
    });

    // Ajouter le rang
    classement.forEach((item, index) => {
      item.rang = item.moyenne !== null ? index + 1 : null;
    });

    res.status(200).json({
      success: true,
      data: {
        semestreId,
        totalEtudiants: classement.length,
        classement
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du classement',
      error: error.message
    });
  }
};

// Obtenir les statistiques générales d'un semestre
exports.getStatistiquesSemestre = async (req, res) => {
  try {
    const { semestreId } = req.params;
    const semestre = await Semestre.findByPk(semestreId, {
      include: [{
        model: AnneeAcademique,
        as: 'anneeAcademique'
      }]
    });
    if (!semestre) {
      return res.status(404).json({
        success: false,
        message: 'Semestre non trouvé'
      });
    }
    const totalEtudiantsInscrits = etudiantsInscrits.length;
    // Récupérer toutes les matières du semestre
    const matieres = await Matiere.findAll({
      where: { semestreId },
      include: [{
        model: Note,
        as: 'notes',
        attributes: ['valeur']
      }]
    });
    // Statistiques globales
    const statistiques = {
      totalMatieres: matieres.length,
      totalEtudiantsInscrits,
      statistiquesParMatiere: []
    };
    matieres.forEach(matiere => {
      const notes = matiere.notes.map(n => parseFloat(n.valeur));
      
      if (notes.length > 0) {
        const moyenne = notes.reduce((acc, val) => acc + val, 0) / notes.length;
        const etudiantsAdmis = notes.filter(n => n >= 10).length;
        
        statistiques.statistiquesParMatiere.push({
          matiere: {
            code: matiere.code,
            nom: matiere.nom
          },
          totalNotes: notes.length,
          moyenne: moyenne.toFixed(2),
          noteMin: Math.min(...notes).toFixed(2),
          noteMax: Math.max(...notes).toFixed(2),
          etudiantsAdmis,
          tauxReussite: ((etudiantsAdmis / notes.length) * 100).toFixed(2) + '%'
        });
      }
    });
    res.status(200).json({
      success: true,
      data: {
        semestre: {
          id: semestre.id,
          nom: semestre.nom,
          anneeAcademique: semestre.anneeAcademique
        },
        statistiques
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
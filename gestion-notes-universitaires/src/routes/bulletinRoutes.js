const express = require('express');
const router = express.Router();
const bulletinController = require('../controllers/bulletinController');

// Routes pour les bulletins
router.get('/etudiant/:etudiantId/semestre/:semestreId', bulletinController.getBulletinEtudiant);
router.get('/classement/semestre/:semestreId', bulletinController.getClassementSemestre);
router.get('/statistiques/semestre/:semestreId', bulletinController.getStatistiquesSemestre);

module.exports = router;
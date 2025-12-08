const express = require('express');
const router = express.Router();
const etudiantController = require('../controllers/etudiantController');

// Routes pour les étudiants
router.post('/', etudiantController.create);
router.get('/', etudiantController.getAll);
router.get('/:id', etudiantController.getById);
router.put('/:id', etudiantController.update);
router.delete('/:id', etudiantController.delete);
router.get('/:id/notes', etudiantController.getNotes);

module.exports = router;
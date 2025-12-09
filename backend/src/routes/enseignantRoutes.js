const express = require('express');
const router = express.Router();
const enseignantController = require('../controllers/enseignantController');

// Routes pour les enseignants
router.post('/', enseignantController.create);
router.get('/', enseignantController.getAll);
router.get('/:id', enseignantController.getById);
router.put('/:id', enseignantController.update);
router.delete('/:id', enseignantController.delete);
router.get('/:id/matieres', enseignantController.getMatieres);

module.exports = router;
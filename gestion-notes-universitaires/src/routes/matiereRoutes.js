const express = require('express');
const router = express.Router();
const matiereController = require('../controllers/matiereController');

// Routes pour les matières
router.post('/', matiereController.create);
router.get('/', matiereController.getAll);
router.get('/:id', matiereController.getById);
router.put('/:id', matiereController.update);
router.delete('/:id', matiereController.delete);
router.get('/:id/statistiques', matiereController.getStatistics);

module.exports = router;
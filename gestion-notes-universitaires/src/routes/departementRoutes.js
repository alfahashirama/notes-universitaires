const express = require('express');
const router = express.Router();
const departementController = require('../controllers/departementController');

// Routes pour les départements
router.post('/', departementController.create);
router.get('/', departementController.getAll);
router.get('/:id', departementController.getById);
router.put('/:id', departementController.update);
router.delete('/:id', departementController.delete);
router.get('/:id/statistiques', departementController.getStatistics);

module.exports = router;
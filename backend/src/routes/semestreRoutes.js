const express = require('express');
const router = express.Router();
const semestreController = require('../controllers/semestreController');

// Routes pour les semestres
router.post('/', semestreController.create);
router.get('/', semestreController.getAll);
router.get('/:id', semestreController.getById);
router.put('/:id', semestreController.update);
router.delete('/:id', semestreController.delete);

module.exports = router;
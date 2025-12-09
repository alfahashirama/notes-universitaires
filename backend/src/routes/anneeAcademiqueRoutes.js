const express = require('express');
const router = express.Router();
const anneeAcademiqueController = require('../controllers/anneeAcademiqueController');

// Routes pour les années académiques
router.post('/', anneeAcademiqueController.create);
router.get('/', anneeAcademiqueController.getAll);
router.get('/active', anneeAcademiqueController.getActive);
router.get('/:id', anneeAcademiqueController.getById);
router.put('/:id', anneeAcademiqueController.update);
router.delete('/:id', anneeAcademiqueController.delete);

module.exports = router;
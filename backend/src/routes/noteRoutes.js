const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// Routes pour les notes
router.post('/', noteController.create);
router.post('/bulk', noteController.createBulk);
router.get('/', noteController.getAll);
router.get('/:id', noteController.getById);
router.put('/:id', noteController.update);
router.delete('/:id', noteController.delete);

module.exports = router;
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/auth');

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);

// Routes protégées (nécessitent une authentification)
router.get('/me', protect, authController.getMe);
router.put('/update-password', protect, authController.updatePassword);
router.put('/update-profile', protect, authController.updateProfile);

// Routes admin uniquement
router.get('/users', protect, authorize('admin'), authController.getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), authController.deleteUser);

module.exports = router;
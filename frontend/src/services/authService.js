import api from './api';
import { jwtDecode } from 'jwt-decode';

const authService = {
  // Inscription
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.utilisateur));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de l\'inscription' };
    }
  },

  // Connexion
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.utilisateur));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la connexion' };
    }
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtenir l'utilisateur connecté
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Obtenir le token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      // Vérifier si le token est expiré
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  },

  // Obtenir le profil de l'utilisateur
  getProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération du profil' };
    }
  },

  // Mettre à jour le profil
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/update-profile', userData);
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour du profil' };
    }
  },

  // Mettre à jour le mot de passe
  updatePassword: async (oldPassword, newPassword) => {
    try {
      const response = await api.put('/auth/update-password', {
        oldPassword,
        newPassword,
      });
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour du mot de passe' };
    }
  },

  // Obtenir tous les utilisateurs (Admin)
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get('/auth/users', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des utilisateurs' };
    }
  },

  // Supprimer un utilisateur (Admin)
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/auth/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression de l\'utilisateur' };
    }
  },
};

export default authService;
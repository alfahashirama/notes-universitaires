import api from './api';

const departementService = {
  // Obtenir tous les départements
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/departements', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des départements' };
    }
  },

  // Obtenir un département par ID
  getById: async (id) => {
    try {
      const response = await api.get(`/departements/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération du département' };
    }
  },

  // Créer un département
  create: async (data) => {
    try {
      const response = await api.post('/departements', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création du département' };
    }
  },

  // Mettre à jour un département
  update: async (id, data) => {
    try {
      const response = await api.put(`/departements/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour du département' };
    }
  },

  // Supprimer un département
  delete: async (id) => {
    try {
      const response = await api.delete(`/departements/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression du département' };
    }
  },

  // Obtenir les statistiques d'un département
  getStatistics: async (id) => {
    try {
      const response = await api.get(`/departements/${id}/statistiques`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des statistiques' };
    }
  },
};

export default departementService;
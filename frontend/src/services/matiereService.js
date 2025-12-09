import api from './api';

const matiereService = {
  // Obtenir toutes les matières
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/matieres', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des matières' };
    }
  },

  // Obtenir une matière par ID
  getById: async (id) => {
    try {
      const response = await api.get(`/matieres/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération de la matière' };
    }
  },

  // Créer une matière
  create: async (data) => {
    try {
      const response = await api.post('/matieres', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création de la matière' };
    }
  },

  // Mettre à jour une matière
  update: async (id, data) => {
    try {
      const response = await api.put(`/matieres/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour de la matière' };
    }
  },

  // Supprimer une matière
  delete: async (id) => {
    try {
      const response = await api.delete(`/matieres/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression de la matière' };
    }
  },

  // Obtenir les statistiques d'une matière
  getStatistics: async (id) => {
    try {
      const response = await api.get(`/matieres/${id}/statistiques`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des statistiques' };
    }
  },
};

export default matiereService;
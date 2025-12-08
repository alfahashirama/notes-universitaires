import api from './api';

const anneeAcademiqueService = {
  // Obtenir toutes les années académiques
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/annees-academiques', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des années académiques' };
    }
  },

  // Obtenir l'année académique active
  getActive: async () => {
    try {
      const response = await api.get('/annees-academiques/active');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération de l\'année active' };
    }
  },

  // Obtenir une année académique par ID
  getById: async (id) => {
    try {
      const response = await api.get(`/annees-academiques/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération de l\'année académique' };
    }
  },

  // Créer une année académique
  create: async (data) => {
    try {
      const response = await api.post('/annees-academiques', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création de l\'année académique' };
    }
  },

  // Mettre à jour une année académique
  update: async (id, data) => {
    try {
      const response = await api.put(`/annees-academiques/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour de l\'année académique' };
    }
  },

  // Supprimer une année académique
  delete: async (id) => {
    try {
      const response = await api.delete(`/annees-academiques/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression de l\'année académique' };
    }
  },
};

export default anneeAcademiqueService;
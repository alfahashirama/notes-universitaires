import api from './api';

const enseignantService = {
  // Obtenir tous les enseignants
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/enseignants', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des enseignants' };
    }
  },

  // Obtenir un enseignant par ID
  getById: async (id) => {
    try {
      const response = await api.get(`/enseignants/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération de l\'enseignant' };
    }
  },

  // Créer un enseignant
  create: async (data) => {
    try {
      const response = await api.post('/enseignants', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création de l\'enseignant' };
    }
  },

  // Mettre à jour un enseignant
  update: async (id, data) => {
    try {
      const response = await api.put(`/enseignants/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour de l\'enseignant' };
    }
  },

  // Supprimer un enseignant
  delete: async (id) => {
    try {
      const response = await api.delete(`/enseignants/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression de l\'enseignant' };
    }
  },

  // Obtenir les matières d'un enseignant
  getMatieres: async (id) => {
    try {
      const response = await api.get(`/enseignants/${id}/matieres`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des matières' };
    }
  },
};

export default enseignantService;
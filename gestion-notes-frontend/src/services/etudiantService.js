import api from './api';

const etudiantService = {
  // Obtenir tous les étudiants
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/etudiants', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des étudiants' };
    }
  },

  // Obtenir un étudiant par ID
  getById: async (id) => {
    try {
      const response = await api.get(`/etudiants/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération de l\'étudiant' };
    }
  },

  // Créer un étudiant
  create: async (data) => {
    try {
      const response = await api.post('/etudiants', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création de l\'étudiant' };
    }
  },

  // Mettre à jour un étudiant
  update: async (id, data) => {
    try {
      const response = await api.put(`/etudiants/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour de l\'étudiant' };
    }
  },

  // Supprimer un étudiant
  delete: async (id) => {
    try {
      const response = await api.delete(`/etudiants/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression de l\'étudiant' };
    }
  },

  // Obtenir les notes d'un étudiant
  getNotes: async (id) => {
    try {
      const response = await api.get(`/etudiants/${id}/notes`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des notes' };
    }
  },
};

export default etudiantService;
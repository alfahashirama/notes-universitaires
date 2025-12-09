import api from './api';

const semestreService = {
  // Obtenir tous les semestres
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/semestres', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des semestres' };
    }
  },

  // Obtenir un semestre par ID
  getById: async (id) => {
    try {
      const response = await api.get(`/semestres/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération du semestre' };
    }
  },

  // Créer un semestre
  create: async (data) => {
    try {
      const response = await api.post('/semestres', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création du semestre' };
    }
  },

  // Mettre à jour un semestre
  update: async (id, data) => {
    try {
      const response = await api.put(`/semestres/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour du semestre' };
    }
  },

  // Supprimer un semestre
  delete: async (id) => {
    try {
      const response = await api.delete(`/semestres/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression du semestre' };
    }
  },
};

export default semestreService;
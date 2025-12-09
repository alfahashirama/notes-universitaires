import api from './api';

const noteService = {
  // Obtenir toutes les notes
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/notes', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des notes' };
    }
  },

  // Obtenir une note par ID
  getById: async (id) => {
    try {
      const response = await api.get(`/notes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération de la note' };
    }
  },

  // Créer une note
  create: async (data) => {
    try {
      const response = await api.post('/notes', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création de la note' };
    }
  },

  // Créer plusieurs notes en une fois
  createBulk: async (notes) => {
    try {
      const response = await api.post('/notes/bulk', { notes });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création des notes' };
    }
  },

  // Mettre à jour une note
  update: async (id, data) => {
    try {
      const response = await api.put(`/notes/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour de la note' };
    }
  },

  // Supprimer une note
  delete: async (id) => {
    try {
      const response = await api.delete(`/notes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression de la note' };
    }
  },
};

export default noteService;
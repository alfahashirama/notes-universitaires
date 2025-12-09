import api from './api';

const bulletinService = {
  // Obtenir le bulletin d'un étudiant pour un semestre
  getBulletinEtudiant: async (etudiantId, semestreId) => {
    try {
      const response = await api.get(`/bulletins/etudiant/${etudiantId}/semestre/${semestreId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération du bulletin' };
    }
  },

  // Obtenir le classement d'un semestre
  getClassementSemestre: async (semestreId, params = {}) => {
    try {
      const response = await api.get(`/bulletins/classement/semestre/${semestreId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération du classement' };
    }
  },

  // Obtenir les statistiques d'un semestre
  getStatistiquesSemestre: async (semestreId) => {
    try {
      const response = await api.get(`/bulletins/statistiques/semestre/${semestreId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des statistiques' };
    }
  },
};

export default bulletinService;
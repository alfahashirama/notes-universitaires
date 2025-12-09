// Rôles utilisateurs
export const USER_ROLES = {
  ADMIN: 'admin',
  ENSEIGNANT: 'enseignant',
  ETUDIANT: 'etudiant',
  SCOLARITE: 'scolarite',
};

// Niveaux d'études
export const NIVEAUX = ['L1', 'L2', 'L3', 'M1', 'M2', 'D1', 'D2', 'D3'];

// Types d'évaluation
export const TYPES_EVALUATION = ['CC', 'TP', 'Examen', 'Projet'];

// Sessions
export const SESSIONS = ['normale', 'rattrapage'];

// Mentions
export const MENTIONS = {
  EXCELLENT: { min: 18, label: 'Excellent', color: 'text-purple-600' },
  TRES_BIEN: { min: 16, label: 'Très Bien', color: 'text-blue-600' },
  BIEN: { min: 14, label: 'Bien', color: 'text-green-600' },
  ASSEZ_BIEN: { min: 12, label: 'Assez Bien', color: 'text-yellow-600' },
  PASSABLE: { min: 10, label: 'Passable', color: 'text-orange-600' },
  AJOURNE: { min: 0, label: 'Ajourné', color: 'text-red-600' },
};

// Limites de pagination
export const PAGINATION_LIMITS = [5, 10, 20, 50, 100];

// Messages
export const MESSAGES = {
  SUCCESS: {
    CREATE: 'Créé avec succès',
    UPDATE: 'Mis à jour avec succès',
    DELETE: 'Supprimé avec succès',
  },
  ERROR: {
    GENERIC: 'Une erreur est survenue',
    NETWORK: 'Erreur de connexion au serveur',
    UNAUTHORIZED: 'Vous n\'êtes pas autorisé',
    NOT_FOUND: 'Ressource non trouvée',
  },
  CONFIRM: {
    DELETE: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
  },
};

// Configuration des toasts
export const TOAST_CONFIG = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};
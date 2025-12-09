import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formater une date
 */
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: fr });
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return '';
  }
};

/**
 * Formater un nom complet
 */
export const formatFullName = (prenom, nom) => {
  return `${prenom} ${nom}`.trim();
};

/**
 * Calculer la moyenne
 */
export const calculateMoyenne = (notes, coefficients) => {
  if (!notes || notes.length === 0) return 0;
  
  let sommeNotesPonderees = 0;
  let sommeCoefficients = 0;

  notes.forEach((note, index) => {
    const coef = coefficients?.[index] || 1;
    sommeNotesPonderees += parseFloat(note) * coef;
    sommeCoefficients += coef;
  });

  return sommeCoefficients > 0 ? (sommeNotesPonderees / sommeCoefficients).toFixed(2) : 0;
};

/**
 * Obtenir la mention selon la moyenne
 */
export const getMention = (moyenne) => {
  const moy = parseFloat(moyenne);
  if (isNaN(moy)) return { label: 'N/A', color: 'text-gray-500' };
  
  if (moy >= 18) return { label: 'Excellent', color: 'text-purple-600' };
  if (moy >= 16) return { label: 'Très Bien', color: 'text-blue-600' };
  if (moy >= 14) return { label: 'Bien', color: 'text-green-600' };
  if (moy >= 12) return { label: 'Assez Bien', color: 'text-yellow-600' };
  if (moy >= 10) return { label: 'Passable', color: 'text-orange-600' };
  return { label: 'Ajourné', color: 'text-red-600' };
};

/**
 * Formater un nombre avec séparateur de milliers
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat('fr-FR').format(number);
};

/**
 * Capitaliser la première lettre
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Tronquer un texte
 */
export const truncate = (str, maxLength = 50) => {
  if (!str) return '';
  return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
};

/**
 * Vérifier si une valeur est vide
 */
export const isEmpty = (value) => {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  );
};

/**
 * Générer une couleur aléatoire
 */
export const getRandomColor = () => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Obtenir les initiales d'un nom
 */
export const getInitials = (prenom, nom) => {
  const p = prenom?.charAt(0)?.toUpperCase() || '';
  const n = nom?.charAt(0)?.toUpperCase() || '';
  return `${p}${n}`;
};

/**
 * Télécharger un fichier
 */
export const downloadFile = (data, filename, type = 'text/csv') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
import { useState, useEffect } from 'react';

/**
 * Hook pour gérer le localStorage de manière réactive
 * @param {string} key - Clé du localStorage
 * @param {any} initialValue - Valeur initiale
 */
export const useLocalStorage = (key, initialValue) => {
  // État pour stocker la valeur
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Récupérer depuis le localStorage
      const item = window.localStorage.getItem(key);
      // Parser la valeur JSON stockée ou retourner initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Erreur lors de la lecture du localStorage:', error);
      return initialValue;
    }
  });

  // Fonction pour mettre à jour la valeur
  const setValue = (value) => {
    try {
      // Permettre à la valeur d'être une fonction comme useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Sauvegarder l'état
      setStoredValue(valueToStore);
      // Sauvegarder dans le localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Erreur lors de l\'écriture dans le localStorage:', error);
    }
  };

  // Fonction pour supprimer la valeur
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Erreur lors de la suppression du localStorage:', error);
    }
  };

  return [storedValue, setValue, removeValue];
};

/**
 * Hook pour gérer le sessionStorage de manière réactive
 * @param {string} key - Clé du sessionStorage
 * @param {any} initialValue - Valeur initiale
 */
export const useSessionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Erreur lors de la lecture du sessionStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Erreur lors de l\'écriture dans le sessionStorage:', error);
    }
  };

  const removeValue = () => {
    try {
      window.sessionStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Erreur lors de la suppression du sessionStorage:', error);
    }
  };

  return [storedValue, setValue, removeValue];
};
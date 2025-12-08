/**
 * Valider un email
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Valider un mot de passe
 */
export const validatePassword = (password) => {
  // Au moins 6 caractères
  return password && password.length >= 6;
};

/**
 * Valider un matricule
 */
export const validateMatricule = (matricule) => {
  // Lettres et chiffres uniquement
  const re = /^[A-Z0-9]+$/;
  return re.test(matricule);
};

/**
 * Valider un numéro de téléphone
 */
export const validatePhone = (phone) => {
  // Format international ou local
  const re = /^[\d\s\+\-\(\)]+$/;
  return re.test(phone);
};

/**
 * Valider une note (entre 0 et 20)
 */
export const validateNote = (note) => {
  const n = parseFloat(note);
  return !isNaN(n) && n >= 0 && n <= 20;
};

/**
 * Valider un coefficient (positif)
 */
export const validateCoefficient = (coef) => {
  const c = parseInt(coef);
  return !isNaN(c) && c > 0;
};

/**
 * Validation de formulaire générique
 */
export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = values[field];

    // Champ requis
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = rule.message || `${field} est requis`;
      return;
    }

    // Validation personnalisée
    if (rule.validate && value) {
      const isValid = rule.validate(value);
      if (!isValid) {
        errors[field] = rule.message || `${field} est invalide`;
      }
    }

    // Longueur minimale
    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = rule.message || `${field} doit contenir au moins ${rule.minLength} caractères`;
    }

    // Longueur maximale
    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = rule.message || `${field} ne doit pas dépasser ${rule.maxLength} caractères`;
    }

    // Valeur minimale
    if (rule.min !== undefined && value && parseFloat(value) < rule.min) {
      errors[field] = rule.message || `${field} doit être au moins ${rule.min}`;
    }

    // Valeur maximale
    if (rule.max !== undefined && value && parseFloat(value) > rule.max) {
      errors[field] = rule.message || `${field} ne doit pas dépasser ${rule.max}`;
    }

    // Pattern
    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${field} est invalide`;
    }
  });

  return errors;
};
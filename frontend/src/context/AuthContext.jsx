import { createContext, useState, useEffect } from 'react';
import authService from '@services/authService';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Charger l'utilisateur au montage du composant
  useEffect(() => {
    checkAuth();
  }, []);

  // Vérifier l'authentification
  const checkAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
        
        // Optionnel : Rafraîchir les données utilisateur
        try {
          const response = await authService.getProfile();
          if (response.success) {
            setUser(response.data);
          }
        } catch (error) {
          console.error('Erreur lors du rafraîchissement du profil:', error);
        }
      }
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Connexion
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        setUser(response.data.utilisateur);
        setIsAuthenticated(true);
        toast.success('Connexion réussie !');
        return { success: true };
      }
    } catch (error) {
      const message = error.message || 'Erreur lors de la connexion';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Inscription
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        setUser(response.data.utilisateur);
        setIsAuthenticated(true);
        toast.success('Inscription réussie !');
        return { success: true };
      }
    } catch (error) {
      const message = error.message || 'Erreur lors de l\'inscription';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Déconnexion
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.info('Déconnexion réussie');
  };

  // Mettre à jour le profil
  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData);
      if (response.success) {
        setUser(response.data);
        toast.success('Profil mis à jour avec succès !');
        return { success: true };
      }
    } catch (error) {
      const message = error.message || 'Erreur lors de la mise à jour du profil';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Mettre à jour le mot de passe
  const updatePassword = async (oldPassword, newPassword) => {
    try {
      const response = await authService.updatePassword(oldPassword, newPassword);
      if (response.success) {
        toast.success('Mot de passe mis à jour avec succès !');
        return { success: true };
      }
    } catch (error) {
      const message = error.message || 'Erreur lors de la mise à jour du mot de passe';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Vérifier le rôle de l'utilisateur
  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    hasRole,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
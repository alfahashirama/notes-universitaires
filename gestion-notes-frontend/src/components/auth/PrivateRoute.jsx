import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks';
import Spinner from '@components/common/Spinner';

const PrivateRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, loading, hasRole } = useAuth();

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return <Spinner fullScreen text="Chargement..." />;
  }

  // Rediriger vers login si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier les rôles si spécifiés
  if (roles.length > 0 && !hasRole(roles)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
          <p className="text-xl text-gray-600 mb-8">
            Accès non autorisé
          </p>
          <p className="text-gray-500 mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>

          {/* BOUTON CORRIGÉ */}
          <a
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retour au tableau de bord
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;

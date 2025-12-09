import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { useAuth } from '@hooks';
import { RegisterForm } from '@components/auth';

const Register = () => {
  const { isAuthenticated, loading } = useAuth();

  // Attendre la fin du chargement de l'authentification
  if (loading) {
    return null; // ou un spinner si vous voulez
  }

  // Rediriger si déjà connecté
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-2xl w-full">
        {/* Bouton retour */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la connexion
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo et titre */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center mb-4">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900">
              Créer un compte
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Rejoignez notre plateforme de gestion universitaire
            </p>
          </div>

          {/* Formulaire d'inscription */}
          <RegisterForm />
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-600">
          En vous inscrivant, vous acceptez nos{' '}
          <a href="#" className="text-primary-600 hover:text-primary-700">
            Conditions d'utilisation
          </a>{' '}
          et notre{' '}
          <a href="#" className="text-primary-600 hover:text-primary-700">
            Politique de confidentialité
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;

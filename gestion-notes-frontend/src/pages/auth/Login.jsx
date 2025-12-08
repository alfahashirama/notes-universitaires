import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '@hooks';
import { LoginForm } from '@components/auth';

const Login = () => {
  const { isAuthenticated, loading } = useAuth();

  // Attendre la fin du chargement de l'authentification
  if (loading) return null; // ou un spinner

  // Rediriger si déjà connecté
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Section gauche - Formulaire */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Logo et titre */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center mb-4">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900">
              Bienvenue !
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Connectez-vous à votre compte pour continuer
            </p>
          </div>

          {/* Formulaire de connexion */}
          <LoginForm />

          {/* Comptes de test */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Comptes de test :
            </p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>👨‍💼 Admin : admin@universite.mg / Admin@123</p>
              <p>👨‍🏫 Enseignant : enseignant@universite.mg / Admin@123</p>
              <p>👨‍🎓 Étudiant : etudiant@universite.mg / Admin@123</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section droite - Image/Illustration */}
      <div className="hidden lg:block relative flex-1 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white space-y-6">
            <h1 className="text-5xl font-bold">
              Système de Gestion des Notes Universitaires
            </h1>
            <p className="text-xl text-primary-100">
              Simplifiez la gestion académique de votre établissement avec notre plateforme intuitive et performante.
            </p>
            <ul className="space-y-4 text-lg">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  ✓
                </div>
                Gestion complète des étudiants et enseignants
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  ✓
                </div>
                Saisie et consultation des notes en temps réel
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  ✓
                </div>
                Génération automatique des bulletins
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  ✓
                </div>
                Statistiques et analyses détaillées
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

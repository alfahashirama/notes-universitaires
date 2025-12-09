import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@components/common';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Illustration 404 */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-primary-100 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page non trouvée
        </h2>
        <p className="text-gray-600 mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          Vérifiez l'URL ou retournez à la page d'accueil.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            icon={ArrowLeft}
            iconPosition="left"
          >
            Retour
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            icon={Home}
            iconPosition="left"
          >
            Page d'accueil
          </Button>
        </div>

        {/* Liens utiles */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Liens utiles :</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              to="/dashboard"
              className="text-primary-600 hover:text-primary-700"
            >
              Tableau de bord
            </Link>
            <Link
              to="/etudiants"
              className="text-primary-600 hover:text-primary-700"
            >
              Étudiants
            </Link>
            <Link
              to="/notes"
              className="text-primary-600 hover:text-primary-700"
            >
              Notes
            </Link>
            <Link
              to="/bulletins"
              className="text-primary-600 hover:text-primary-700"
            >
              Bulletins
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
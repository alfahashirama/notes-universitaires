import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { Badge, Spinner } from '@components/common';
import bulletinService from '@services/bulletinService';
import { getMention } from '@utils/helpers';

const Classement = ({ semestreId, filters = {} }) => {
  const [classement, setClassement] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (semestreId) {
      loadClassement();
    }
  }, [semestreId, filters]);

  const loadClassement = async () => {
    try {
      setLoading(true);
      const response = await bulletinService.getClassementSemestre(semestreId, filters);
      if (response.success) {
        setClassement(response.data.classement || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du classement:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rang) => {
    if (rang === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rang === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rang === 3) return <Award className="w-6 h-6 text-orange-500" />;
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (classement.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucun classement disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {classement.map((item, index) => {
        const mention = item.moyenne ? getMention(item.moyenne) : null;
        const isPodium = item.rang <= 3;

        return (
          <div
            key={index}
            className={`
              flex items-center justify-between p-4 rounded-lg transition-all
              ${isPodium ? 'bg-gradient-to-r from-primary-50 to-white border-2 border-primary-200' : 'bg-white border border-gray-200'}
              hover:shadow-md
            `}
          >
            <div className="flex items-center gap-4 flex-1">
              {/* Rang */}
              <div className="flex items-center justify-center w-12 h-12">
                {getRankIcon(item.rang) || (
                  <span className="text-2xl font-bold text-gray-400">#{item.rang}</span>
                )}
              </div>

              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-bold">
                {item.etudiant.nomComplet.split(' ').map(n => n[0]).join('')}
              </div>

              {/* Infos étudiant */}
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{item.etudiant.nomComplet}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">{item.etudiant.matricule}</span>
                  <Badge variant="info" size="sm">{item.etudiant.niveau}</Badge>
                  {item.etudiant.departement && (
                    <span className="text-xs text-gray-400">
                      {item.etudiant.departement.code}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Moyenne et mention */}
            <div className="text-right">
              {item.moyenne ? (
                <>
                  <p className={`text-3xl font-bold ${mention?.color}`}>
                    {item.moyenne.toFixed(2)}
                  </p>
                  <p className={`text-sm font-medium ${mention?.color}`}>
                    {mention?.label}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-400 italic">Pas de notes</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Classement;
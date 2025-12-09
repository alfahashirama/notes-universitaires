import React, { useEffect, useState } from 'react';
import { X, TrendingUp, TrendingDown, Award, Users } from 'lucide-react';
import { Badge, Button, Spinner, Card } from '@components/common';
import matiereService from '@services/matiereService';

const MatiereStatistics = ({ matiere, onClose }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (matiere?.id) {
      loadStatistics();
    }
  }, [matiere]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const response = await matiereService.getStatistics(matiere.id);
      if (response.success) {
        setStats(response.data.statistiques);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!matiere) return null;

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{matiere.nom}</h3>
          <p className="text-sm text-gray-500 mt-1">{matiere.code}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : stats ? (
        <div className="space-y-6">
          {/* Statistiques générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              label="Notes saisies"
              value={stats.totalNotes || 0}
              color="bg-blue-500"
            />
            <StatCard
              icon={TrendingUp}
              label="Moyenne"
              value={stats.moyenne || 'N/A'}
              color="bg-green-500"
            />
            <StatCard
              icon={Award}
              label="Taux de réussite"
              value={stats.tauxReussite || 'N/A'}
              color="bg-purple-500"
            />
            <StatCard
              icon={TrendingDown}
              label="Ajournés"
              value={stats.etudiantsAjournes || 0}
              color="bg-red-500"
            />
          </div>

          {/* Notes min/max */}
          {stats.totalNotes > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Note minimale</p>
                  <p className="text-3xl font-bold text-red-600">{stats.noteMin}</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Note maximale</p>
                  <p className="text-3xl font-bold text-green-600">{stats.noteMax}</p>
                </div>
              </Card>
            </div>
          )}

          {/* Informations de la matière */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <h4 className="font-semibold text-gray-900">Informations</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Coefficient :</span>
                <Badge variant="info" className="ml-2">{matiere.coefficient}</Badge>
              </div>
              <div>
                <span className="text-gray-600">Crédits ECTS :</span>
                <Badge variant="success" className="ml-2">{matiere.creditECTS}</Badge>
              </div>
            </div>
          </div>

          {stats.totalNotes === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Aucune note saisie pour cette matière</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Impossible de charger les statistiques</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button onClick={onClose}>Fermer</Button>
      </div>
    </div>
  );
};

export default MatiereStatistics;
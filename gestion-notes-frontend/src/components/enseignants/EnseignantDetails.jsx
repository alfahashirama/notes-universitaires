import React, { useEffect, useState } from 'react';
import { X, Mail, Phone, BookOpen, Building2, Award } from 'lucide-react';
import { Badge, Button, Spinner } from '@components/common';
import { getInitials } from '@utils/helpers';
import enseignantService from '@services/enseignantService';

const EnseignantDetails = ({ enseignant, onClose, onEdit }) => {
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (enseignant?.id) {
      loadMatieres();
    }
  }, [enseignant]);

  const loadMatieres = async () => {
    try {
      setLoading(true);
      const response = await enseignantService.getMatieres(enseignant.id);
      if (response.success) {
        setMatieres(response.data.matieres || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des matières:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!enseignant) return null;

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="p-2 bg-white rounded-lg">
        <Icon className="w-5 h-5 text-green-600" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value || 'Non renseigné'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header avec photo */}
      <div className="flex items-center justify-between pb-6 border-b">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white text-2xl font-bold">
            {getInitials(enseignant.prenom, enseignant.nom)}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {enseignant.prenom} {enseignant.nom}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="success">{enseignant.matricule}</Badge>
              {enseignant.specialite && (
                <Badge variant="purple">{enseignant.specialite}</Badge>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Informations de contact */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Informations de contact
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem icon={Mail} label="Email" value={enseignant.email} />
          <InfoItem icon={Phone} label="Téléphone" value={enseignant.telephone} />
          <InfoItem
            icon={Building2}
            label="Département"
            value={`${enseignant.departement?.nom} (${enseignant.departement?.code})`}
          />
          <InfoItem
            icon={Award}
            label="Spécialité"
            value={enseignant.specialite}
          />
        </div>
      </div>

      {/* Matières enseignées */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Matières enseignées ({matieres.length})
        </h4>

        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : matieres.length > 0 ? (
          <div className="space-y-3">
            {matieres.map((matiere) => (
              <div
                key={matiere.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{matiere.nom}</p>
                  <p className="text-sm text-gray-500">{matiere.code}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="info">Coef. {matiere.coefficient}</Badge>
                  <Badge variant="success">{matiere.creditECTS} ECTS</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucune matière assignée</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
        <Button onClick={() => onEdit(enseignant)}>Modifier</Button>
      </div>
    </div>
  );
};

export default EnseignantDetails;
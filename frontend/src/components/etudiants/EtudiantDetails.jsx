import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, GraduationCap, Building2 } from 'lucide-react';
import { Badge, Button } from '@components/common';
import { formatDate, getInitials } from '@utils/helpers';

const EtudiantDetails = ({ etudiant, onClose, onEdit }) => {
  if (!etudiant) return null;

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="p-2 bg-white rounded-lg">
        <Icon className="w-5 h-5 text-primary-600" />
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
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white text-2xl font-bold">
            {getInitials(etudiant.prenom, etudiant.nom)}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {etudiant.prenom} {etudiant.nom}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="primary">{etudiant.matricule}</Badge>
              <Badge variant="info">{etudiant.niveau}</Badge>
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

      {/* Informations personnelles */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Informations personnelles
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            icon={Calendar}
            label="Date de naissance"
            value={formatDate(etudiant.dateNaissance)}
          />
          <InfoItem
            icon={MapPin}
            label="Lieu de naissance"
            value={etudiant.lieuNaissance}
          />
          <InfoItem
            icon={Mail}
            label="Email"
            value={etudiant.email}
          />
          <InfoItem
            icon={Phone}
            label="Téléphone"
            value={etudiant.telephone}
          />
        </div>
      </div>

      {/* Informations académiques */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Informations académiques
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            icon={GraduationCap}
            label="Niveau"
            value={etudiant.niveau}
          />
          <InfoItem
            icon={Building2}
            label="Département"
            value={`${etudiant.departement?.nom} (${etudiant.departement?.code})`}
          />
        </div>
      </div>

      {/* Adresse */}
      {etudiant.adresse && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Adresse</h4>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{etudiant.adresse}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
        <Button onClick={() => onEdit(etudiant)}>
          Modifier
        </Button>
      </div>
    </div>
  );
};

export default EtudiantDetails;
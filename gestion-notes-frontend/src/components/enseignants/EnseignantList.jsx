import React from 'react';
import { Edit, Trash2, Eye, Mail, Phone, BookOpen } from 'lucide-react';
import { Table, Badge, Button } from '@components/common';

const EnseignantList = ({ enseignants, onEdit, onDelete, onView, loading }) => {
  const columns = [
    {
      key: 'matricule',
      label: 'Matricule',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: 'nomComplet',
      label: 'Nom complet',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-700 font-semibold text-sm">
              {row.prenom?.[0]}{row.nom?.[0]}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {row.prenom} {row.nom}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Mail className="w-3 h-3" />
              {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'specialite',
      label: 'Spécialité',
      render: (value) => (
        <Badge variant="purple">{value || 'Non spécifié'}</Badge>
      ),
    },
    {
      key: 'departement',
      label: 'Département',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value?.nom || 'Non assigné'}
        </span>
      ),
    },
    {
      key: 'telephone',
      label: 'Téléphone',
      render: (value) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Phone className="w-3 h-3" />
          {value || 'N/A'}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onView(row)}
            icon={Eye}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(row)}
            icon={Edit}
            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(row)}
            icon={Trash2}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          />
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={enseignants}
      loading={loading}
      emptyMessage="Aucun enseignant trouvé"
    />
  );
};

export default EnseignantList;
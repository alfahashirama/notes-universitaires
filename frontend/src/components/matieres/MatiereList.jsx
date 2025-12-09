import React from 'react';
import { Edit, Trash2, BarChart3, User } from 'lucide-react';
import { Table, Badge, Button } from '@components/common';

const MatiereList = ({ matieres, onEdit, onDelete, onViewStats, loading }) => {
  const columns = [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: 'nom',
      label: 'Nom de la matière',
      sortable: true,
      render: (value) => (
        <span className="text-gray-900">{value}</span>
      ),
    },
    {
      key: 'coefficient',
      label: 'Coefficient',
      render: (value) => <Badge variant="info">{value}</Badge>,
    },
    {
      key: 'creditECTS',
      label: 'Crédits ECTS',
      render: (value) => <Badge variant="success">{value}</Badge>,
    },
    {
      key: 'semestre',
      label: 'Semestre',
      render: (value) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{value?.nom}</p>
          <p className="text-xs text-gray-500">
            {value?.anneeAcademique?.libelle}
          </p>
        </div>
      ),
    },
    {
      key: 'enseignant',
      label: 'Enseignant',
      render: (value) => (
        <div className="flex items-center gap-2">
          {value ? (
            <>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-700 font-semibold text-xs">
                  {value.prenom?.[0]}{value.nom?.[0]}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {value.prenom} {value.nom}
                </p>
              </div>
            </>
          ) : (
            <span className="text-sm text-gray-500 italic">Non assigné</span>
          )}
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
            onClick={() => onViewStats(row)}
            icon={BarChart3}
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
      data={matieres}
      loading={loading}
      emptyMessage="Aucune matière trouvée"
    />
  );
};

export default MatiereList;
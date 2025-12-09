import React, { useState, useEffect } from 'react';
import { Plus, Users, GraduationCap, BarChart3 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card, Button, Modal, Table, Badge, Alert } from '@components/common';
import DepartementForm from '@components/departements/DepartementForm';
import departementService from '@services/departementService';
import { useModal } from '@hooks';
import { Edit, Trash2 } from 'lucide-react';

const Departements = () => {
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDepartement, setSelectedDepartement] = useState(null);
  const [stats, setStats] = useState(null);

  const createModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();
  const statsModal = useModal();

  useEffect(() => {
    loadDepartements();
  }, []);

  const loadDepartements = async () => {
    try {
      setLoading(true);
      const response = await departementService.getAll({ limit: 100 });
      if (response.success) {
        setDepartements(response.data);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des départements');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async (id) => {
    try {
      setLoading(true);
      const response = await departementService.getStatistics(id);
      if (response.success) {
        setStats(response.data);
        statsModal.openModal();
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      setLoading(true);
      const response = await departementService.create(data);
      if (response.success) {
        toast.success('Département créé avec succès');
        createModal.closeModal();
        loadDepartements();
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (data) => {
    try {
      setLoading(true);
      const response = await departementService.update(selectedDepartement.id, data);
      if (response.success) {
        toast.success('Département mis à jour avec succès');
        editModal.closeModal();
        loadDepartements();
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await departementService.delete(selectedDepartement.id);
      if (response.success) {
        toast.success('Département supprimé avec succès');
        deleteModal.closeModal();
        loadDepartements();
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'code',
      label: 'Code',
      render: (value) => <Badge variant="primary" size="lg">{value}</Badge>,
    },
    {
      key: 'nom',
      label: 'Nom',
      render: (value) => <span className="font-medium text-gray-900">{value}</span>,
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => <span className="text-sm text-gray-600">{value || 'Aucune description'}</span>,
    },
    {
      key: 'etudiants',
      label: 'Étudiants',
      render: (value) => (
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium">{value?.length || 0}</span>
        </div>
      ),
    },
    {
      key: 'enseignants',
      label: 'Enseignants',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium">{value?.length || 0}</span>
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
            onClick={() => {
              setSelectedDepartement(row);
              loadStatistics(row.id);
            }}
            icon={BarChart3}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedDepartement(row);
              editModal.openModal();
            }}
            icon={Edit}
            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedDepartement(row);
              deleteModal.openModal();
            }}
            icon={Trash2}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Départements</h1>
          <p className="mt-2 text-gray-600">Gérer les départements de l'université</p>
        </div>
        <Button icon={Plus} iconPosition="left" onClick={createModal.openModal}>
          Nouveau département
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={departements} loading={loading} emptyMessage="Aucun département trouvé" />
      </Card>

      <Modal isOpen={createModal.isOpen} onClose={createModal.closeModal} title="Nouveau département" size="lg">
        <DepartementForm onSubmit={handleCreate} onCancel={createModal.closeModal} loading={loading} />
      </Modal>

      <Modal isOpen={editModal.isOpen} onClose={editModal.closeModal} title="Modifier le département" size="lg">
        <DepartementForm
          departement={selectedDepartement}
          onSubmit={handleEdit}
          onCancel={editModal.closeModal}
          loading={loading}
        />
      </Modal>

      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.closeModal} title="Confirmer la suppression" size="sm">
        <div className="space-y-4">
          <Alert type="warning" message="Cette action supprimera le département et ses associations." />
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir supprimer le département <strong>{selectedDepartement?.nom}</strong> ?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={deleteModal.closeModal} disabled={loading}>
              Annuler
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={loading} disabled={loading}>
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={statsModal.isOpen} onClose={statsModal.closeModal} title="Statistiques du département" size="lg">
        {stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card padding={false} className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <GraduationCap className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Étudiants</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.statistiques?.totalEtudiants || 0}
                    </p>
                  </div>
                </div>
              </Card>

              <Card padding={false} className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Enseignants</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.statistiques?.totalEnseignants || 0}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {stats.statistiques?.etudiantsParNiveau && stats.statistiques.etudiantsParNiveau.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par niveau</h3>
                <div className="space-y-2">
                  {stats.statistiques.etudiantsParNiveau.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{item.niveau}</span>
                      <Badge variant="info">{item.count} étudiant(s)</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={statsModal.closeModal}>Fermer</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Departements;
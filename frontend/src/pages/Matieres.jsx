import React, { useState, useEffect, useCallback } from 'react';
import { Plus, BookOpen, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card, Button, Modal, SearchBar, Pagination, Select, Alert } from '@components/common';
import MatiereList from '@components/matieres/MatiereList';
import MatiereForm from '@components/matieres/MatiereForm';
import MatiereStatistics from '@components/matieres/MatiereStatistics';
import matiereService from '@services/matiereService';
import semestreService from '@services/semestreService';
import { useModal, usePagination, useFilters } from '@hooks';

const Matieres = () => {
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMatiere, setSelectedMatiere] = useState(null);
  const [semestres, setSemestres] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const createModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();
  const statsModal = useModal();

  const pagination = usePagination(1, 10);
  const filters = useFilters({
    search: '',
    semestreId: '',
  });

  useEffect(() => {
    loadMatieres();
  }, [pagination.page, pagination.limit, filters.filters]);

  useEffect(() => {
    loadSemestres();
  }, []);

  const loadMatieres = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters.filters,
      };

      const response = await matiereService.getAll(params);
      if (response.success) {
        setMatieres(response.data);
        pagination.setPaginationData(response.pagination);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des matières');
    } finally {
      setLoading(false);
    }
  };

  const loadSemestres = async () => {
    try {
      const response = await semestreService.getAll({ limit: 100 });
      if (response.success) {
        setSemestres(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des semestres:', error);
    }
  };

  const handleSearch = useCallback((searchTerm) => {
    filters.updateFilter('search', searchTerm);
    pagination.handlePageChange(1);
  }, []);

  const handleCreate = async (data) => {
    try {
      setLoading(true);
      const response = await matiereService.create(data);
      if (response.success) {
        toast.success('Matière créée avec succès');
        createModal.closeModal();
        loadMatieres();
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
      const response = await matiereService.update(selectedMatiere.id, data);
      if (response.success) {
        toast.success('Matière mise à jour avec succès');
        editModal.closeModal();
        loadMatieres();
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
      const response = await matiereService.delete(selectedMatiere.id);
      if (response.success) {
        toast.success('Matière supprimée avec succès');
        deleteModal.closeModal();
        loadMatieres();
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const handleViewStats = (matiere) => {
    setSelectedMatiere(matiere);
    statsModal.openModal();
  };

  const semestreOptions = semestres.map((sem) => ({
    value: sem.id,
    label: `${sem.nom} - ${sem.anneeAcademique?.libelle}`,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Matières</h1>
          <p className="mt-2 text-gray-600">Gérer les matières enseignées</p>
        </div>
        <Button icon={Plus} iconPosition="left" onClick={createModal.openModal}>
          Nouvelle matière
        </Button>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Rechercher une matière par code ou nom..."
                onSearch={handleSearch}
              />
            </div>
            <Button variant="outline" icon={Filter} onClick={() => setShowFilters(!showFilters)}>
              Filtres
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <Select
                label="Semestre"
                value={filters.filters.semestreId}
                onChange={(e) => filters.updateFilter('semestreId', e.target.value)}
                options={semestreOptions}
                placeholder="Tous les semestres"
              />
              <div className="flex items-end">
                <Button variant="outline" fullWidth onClick={filters.resetFilters}>
                  Réinitialiser
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <MatiereList
          matieres={matieres}
          loading={loading}
          onEdit={(matiere) => {
            setSelectedMatiere(matiere);
            editModal.openModal();
          }}
          onDelete={(matiere) => {
            setSelectedMatiere(matiere);
            deleteModal.openModal();
          }}
          onViewStats={handleViewStats}
        />

        {!loading && matieres.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Affichage de {((pagination.page - 1) * pagination.limit) + 1} à{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total} matières
            </p>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={pagination.handlePageChange}
            />
          </div>
        )}
      </Card>

      <Modal isOpen={createModal.isOpen} onClose={createModal.closeModal} title="Nouvelle matière" size="lg">
        <MatiereForm onSubmit={handleCreate} onCancel={createModal.closeModal} loading={loading} />
      </Modal>

      <Modal isOpen={editModal.isOpen} onClose={editModal.closeModal} title="Modifier la matière" size="lg">
        <MatiereForm
          matiere={selectedMatiere}
          onSubmit={handleEdit}
          onCancel={editModal.closeModal}
          loading={loading}
        />
      </Modal>

      <Modal isOpen={statsModal.isOpen} onClose={statsModal.closeModal} title="Statistiques" size="lg">
        <MatiereStatistics matiere={selectedMatiere} onClose={statsModal.closeModal} />
      </Modal>

      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.closeModal} title="Confirmer la suppression" size="sm">
        <div className="space-y-4">
          <Alert type="warning" message="Cette action supprimera également toutes les notes associées." />
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir supprimer la matière <strong>{selectedMatiere?.nom}</strong> ?
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
    </div>
  );
};

export default Matieres;
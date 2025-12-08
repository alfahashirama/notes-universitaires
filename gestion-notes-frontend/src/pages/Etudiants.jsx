import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Download, Upload, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  Card,
  Button,
  Modal,
  SearchBar,
  Pagination,
  Select,
  Spinner,
  Alert,
} from '@components/common';
import EtudiantList from '@components/etudiants/EtudiantList';
import EtudiantForm from '@components/etudiants/EtudiantForm';
import EtudiantDetails from '@components/etudiants/EtudiantDetails';
import etudiantService from '@services/etudiantService';
import departementService from '@services/departementService';
import { useModal, usePagination, useFilters } from '@hooks';
import { NIVEAUX } from '@utils/constants';

const Etudiants = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEtudiant, setSelectedEtudiant] = useState(null);
  const [departements, setDepartements] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Modals
  const createModal = useModal();
  const editModal = useModal();
  const detailsModal = useModal();
  const deleteModal = useModal();

  // Pagination
  const pagination = usePagination(1, 10);

  // Filtres
  const filters = useFilters({
    search: '',
    niveau: '',
    departementId: '',
  });

  // Charger les données au montage et lors des changements de filtres
  useEffect(() => {
    loadEtudiants();
  }, [pagination.page, pagination.limit, filters.filters]);

  useEffect(() => {
    loadDepartements();
  }, []);

  const loadEtudiants = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters.filters,
      };

      const response = await etudiantService.getAll(params);
      if (response.success) {
        setEtudiants(response.data);
        pagination.setPaginationData(response.pagination);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des étudiants');
    } finally {
      setLoading(false);
    }
  };

  const loadDepartements = async () => {
    try {
      const response = await departementService.getAll({ limit: 100 });
      if (response.success) {
        setDepartements(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des départements:', error);
    }
  };

  const handleSearch = useCallback((searchTerm) => {
    filters.updateFilter('search', searchTerm);
    pagination.handlePageChange(1); // Retour à la première page
  }, []);

  const handleCreate = async (data) => {
    try {
      setLoading(true);
      const response = await etudiantService.create(data);
      if (response.success) {
        toast.success('Étudiant créé avec succès');
        createModal.closeModal();
        loadEtudiants();
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
      const response = await etudiantService.update(selectedEtudiant.id, data);
      if (response.success) {
        toast.success('Étudiant mis à jour avec succès');
        editModal.closeModal();
        loadEtudiants();
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
      const response = await etudiantService.delete(selectedEtudiant.id);
      if (response.success) {
        toast.success('Étudiant supprimé avec succès');
        deleteModal.closeModal();
        loadEtudiants();
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (etudiant) => {
    setSelectedEtudiant(etudiant);
    detailsModal.openModal();
  };

  const handleEditClick = (etudiant) => {
    setSelectedEtudiant(etudiant);
    editModal.openModal();
  };

  const handleDeleteClick = (etudiant) => {
    setSelectedEtudiant(etudiant);
    deleteModal.openModal();
  };

  const departementOptions = departements.map((dept) => ({
    value: dept.id,
    label: `${dept.nom} (${dept.code})`,
  }));

  const niveauOptions = NIVEAUX.map((niveau) => ({
    value: niveau,
    label: niveau,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Étudiants</h1>
          <p className="mt-2 text-gray-600">
            Gérer les étudiants de l'université
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={Upload}
            iconPosition="left"
          >
            Importer
          </Button>
          <Button
            variant="outline"
            icon={Download}
            iconPosition="left"
          >
            Exporter
          </Button>
          <Button
            icon={Plus}
            iconPosition="left"
            onClick={createModal.openModal}
          >
            Nouvel étudiant
          </Button>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Rechercher par nom, prénom, matricule ou email..."
                onSearch={handleSearch}
              />
            </div>
            <Button
              variant="outline"
              icon={Filter}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filtres
            </Button>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <Select
                label="Niveau"
                value={filters.filters.niveau}
                onChange={(e) => filters.updateFilter('niveau', e.target.value)}
                options={niveauOptions}
                placeholder="Tous les niveaux"
              />
              <Select
                label="Département"
                value={filters.filters.departementId}
                onChange={(e) => filters.updateFilter('departementId', e.target.value)}
                options={departementOptions}
                placeholder="Tous les départements"
              />
              <div className="flex items-end">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={filters.resetFilters}
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Liste des étudiants */}
      <Card>
        <EtudiantList
          etudiants={etudiants}
          loading={loading}
          onView={handleView}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        {/* Pagination */}
        {!loading && etudiants.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Affichage de {((pagination.page - 1) * pagination.limit) + 1} à{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} sur{' '}
              {pagination.total} étudiants
            </p>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={pagination.handlePageChange}
            />
          </div>
        )}
      </Card>

      {/* Modal Création */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.closeModal}
        title="Nouvel étudiant"
        size="lg"
      >
        <EtudiantForm
          onSubmit={handleCreate}
          onCancel={createModal.closeModal}
          loading={loading}
        />
      </Modal>

      {/* Modal Modification */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        title="Modifier l'étudiant"
        size="lg"
      >
        <EtudiantForm
          etudiant={selectedEtudiant}
          onSubmit={handleEdit}
          onCancel={editModal.closeModal}
          loading={loading}
        />
      </Modal>

      {/* Modal Détails */}
      <Modal
        isOpen={detailsModal.isOpen}
        onClose={detailsModal.closeModal}
        title="Détails de l'étudiant"
        size="lg"
      >
        <EtudiantDetails
          etudiant={selectedEtudiant}
          onClose={detailsModal.closeModal}
          onEdit={(etudiant) => {
            detailsModal.closeModal();
            handleEditClick(etudiant);
          }}
        />
      </Modal>

      {/* Modal Suppression */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        title="Confirmer la suppression"
        size="sm"
      >
        <div className="space-y-4">
          <Alert
            type="warning"
            message="Cette action est irréversible. Toutes les notes de cet étudiant seront également supprimées."
          />
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir supprimer l'étudiant{' '}
            <strong>
              {selectedEtudiant?.prenom} {selectedEtudiant?.nom}
            </strong>{' '}
            ?
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={deleteModal.closeModal}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={loading}
              disabled={loading}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Etudiants;
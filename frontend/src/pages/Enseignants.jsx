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
  Alert,
} from '@components/common';

import EnseignantList from '@components/enseignants/EnseignantList';
import EnseignantForm from '@components/enseignants/EnseignantForm';
import EnseignantDetails from '@components/enseignants/EnseignantDetails'; // 🔥 Import ajouté

import enseignantService from '@services/enseignantService';
import departementService from '@services/departementService';
import { useModal, usePagination, useFilters } from '@hooks';

const Enseignants = () => {
  const [enseignants, setEnseignants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEnseignant, setSelectedEnseignant] = useState(null);
  const [departements, setDepartements] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // -------------------- MODALES --------------------
  const createModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();
  const detailsModal = useModal(); // 🔥 Modal pour les détails

  // -------------------- PAGINATION + FILTRES --------------------
  const pagination = usePagination(1, 10);
  const filters = useFilters({
    search: '',
    departementId: '',
  });

  // -------------------- CHARGEMENT DES ENSEIGNANTS --------------------
  useEffect(() => {
    loadEnseignants();
  }, [pagination.page, pagination.limit, filters.filters]);

  // -------------------- CHARGEMENT DES DEPARTEMENTS --------------------
  useEffect(() => {
    loadDepartements();
  }, []);

  const loadEnseignants = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters.filters,
      };

      const response = await enseignantService.getAll(params);
      if (response.success) {
        setEnseignants(response.data);
        pagination.setPaginationData(response.pagination);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des enseignants');
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

  // -------------------- RECHERCHE --------------------
  const handleSearch = useCallback((searchTerm) => {
    filters.updateFilter('search', searchTerm);
    pagination.handlePageChange(1);
  }, []);

  // -------------------- CRUD --------------------
  const handleCreate = async (data) => {
    try {
      setLoading(true);
      const response = await enseignantService.create(data);
      if (response.success) {
        toast.success('Enseignant créé avec succès');
        createModal.closeModal();
        loadEnseignants();
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
      const response = await enseignantService.update(selectedEnseignant.id, data);
      if (response.success) {
        toast.success('Enseignant mis à jour avec succès');
        editModal.closeModal();
        loadEnseignants();
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
      const response = await enseignantService.delete(selectedEnseignant.id);
      if (response.success) {
        toast.success('Enseignant supprimé avec succès');
        deleteModal.closeModal();
        loadEnseignants();
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  // -------------------- ACTIONS --------------------
  const handleEditClick = (enseignant) => {
    setSelectedEnseignant(enseignant);
    editModal.openModal();
  };

  const handleDeleteClick = (enseignant) => {
    setSelectedEnseignant(enseignant);
    deleteModal.openModal();
  };

  const handleView = (enseignant) => {
    setSelectedEnseignant(enseignant);
    detailsModal.openModal();
  };

  const departementOptions = departements.map((dept) => ({
    value: dept.id,
    label: `${dept.nom} (${dept.code})`,
  }));

  return (
    <div className="space-y-6">

      {/* ------------ HEADER ------------- */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enseignants</h1>
          <p className="mt-2 text-gray-600">
            Gérer le corps enseignant de l'université
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" icon={Upload}>Importer</Button>
          <Button variant="outline" icon={Download}>Exporter</Button>
          <Button icon={Plus} onClick={createModal.openModal}>
            Nouvel enseignant
          </Button>
        </div>
      </div>

      {/* ------------ FILTRES / SEARCH ------------- */}
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

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <Select
                label="Département"
                value={filters.filters.departementId}
                onChange={(e) => filters.updateFilter('departementId', e.target.value)}
                options={departementOptions}
                placeholder="Tous les départements"
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

      {/* ------------ LISTE DES ENSEIGNANTS ------------- */}
      <Card>
        <EnseignantList
          enseignants={enseignants}
          loading={loading}
          onView={handleView}       // 🔥 Correction ajoutée
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        {!loading && enseignants.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Affichage de {((pagination.page - 1) * pagination.limit) + 1} à{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} sur{' '}
              {pagination.total} enseignants
            </p>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={pagination.handlePageChange}
            />
          </div>
        )}
      </Card>

      {/* ------------ MODAL CREATION ------------- */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.closeModal}
        title="Nouvel enseignant"
        size="lg"
      >
        <EnseignantForm
          onSubmit={handleCreate}
          onCancel={createModal.closeModal}
          loading={loading}
        />
      </Modal>

      {/* ------------ MODAL EDITION ------------- */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        title="Modifier l'enseignant"
        size="lg"
      >
        <EnseignantForm
          enseignant={selectedEnseignant}
          onSubmit={handleEdit}
          onCancel={editModal.closeModal}
          loading={loading}
        />
      </Modal>

      {/* ------------ MODAL DETAILS 🔥 AJOUTÉ ------------- */}
      <Modal
        isOpen={detailsModal.isOpen}
        onClose={detailsModal.closeModal}
        title="Détails de l'enseignant"
        size="lg"
      >
        <EnseignantDetails
          enseignant={selectedEnseignant}
          onClose={detailsModal.closeModal}
          onEdit={(enseignant) => {
            detailsModal.closeModal();
            handleEditClick(enseignant);
          }}
        />
      </Modal>

      {/* ------------ MODAL SUPPRESSION ------------- */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        title="Confirmer la suppression"
        size="sm"
      >
        <div className="space-y-4">
          <Alert type="warning" message="Cette action est irréversible." />
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir supprimer l'enseignant{' '}
            <strong>
              {selectedEnseignant?.prenom} {selectedEnseignant?.nom}
            </strong>{' '}
            ?
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

export default Enseignants;

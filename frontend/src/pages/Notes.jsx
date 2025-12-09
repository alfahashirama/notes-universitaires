import React, { useState, useEffect, useCallback } from 'react';
import { Plus, FileText, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  Card,
  Button,
  Modal,
  SearchBar,
  Pagination,
  Table,
  Badge,
  Alert,
  Select,
} from '@components/common';
import NoteForm from '@components/notes/NoteForm';
import BulkNoteForm from '@components/notes/BulkNoteForm';
import noteService from '@services/noteService';
import matiereService from '@services/matiereService';
import { useModal, usePagination, useFilters } from '@hooks';
import { getMention } from '@utils/helpers';
import { Edit, Trash2 } from 'lucide-react';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [matieres, setMatieres] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const createModal = useModal();
  const bulkModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();

  const pagination = usePagination(1, 10);
  const filters = useFilters({
    matiereId: '',
    session: '',
    typeEvaluation: '',
  });

  useEffect(() => {
    loadNotes();
  }, [pagination.page, pagination.limit, filters.filters]);

  useEffect(() => {
    loadMatieres();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters.filters,
      };

      const response = await noteService.getAll(params);
      if (response.success) {
        setNotes(response.data);
        pagination.setPaginationData(response.pagination);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des notes');
    } finally {
      setLoading(false);
    }
  };

  const loadMatieres = async () => {
    try {
      const response = await matiereService.getAll({ limit: 1000 });
      if (response.success) {
        setMatieres(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des matières:', error);
    }
  };

  const handleCreate = async (data) => {
    try {
      setLoading(true);
      const response = await noteService.create(data);
      if (response.success) {
        toast.success('Note créée avec succès');
        createModal.closeModal();
        loadNotes();
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCreate = async (notesData) => {
    try {
      setLoading(true);
      const response = await noteService.createBulk(notesData);
      if (response.success) {
        toast.success(`${notesData.length} note(s) créée(s) avec succès`);
        bulkModal.closeModal();
        loadNotes();
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
      const response = await noteService.update(selectedNote.id, data);
      if (response.success) {
        toast.success('Note mise à jour avec succès');
        editModal.closeModal();
        loadNotes();
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
      const response = await noteService.delete(selectedNote.id);
      if (response.success) {
        toast.success('Note supprimée avec succès');
        deleteModal.closeModal();
        loadNotes();
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const matiereOptions = matieres.map((mat) => ({
    value: mat.id,
    label: `${mat.code} - ${mat.nom}`,
  }));

  const columns = [
    {
      key: 'etudiant',
      label: 'Étudiant',
      render: (value) => (
        <div>
          <p className="font-medium text-gray-900">{value?.prenom} {value?.nom}</p>
          <p className="text-xs text-gray-500">{value?.matricule}</p>
        </div>
      ),
    },
    {
      key: 'matiere',
      label: 'Matière',
      render: (value) => (
        <div>
          <p className="font-medium text-gray-900">{value?.nom}</p>
          <p className="text-xs text-gray-500">{value?.code}</p>
        </div>
      ),
    },
    {
      key: 'valeur',
      label: 'Note',
      render: (value) => {
        const mention = getMention(value);
        return (
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${mention.color}`}>
              {parseFloat(value).toFixed(2)}
            </span>
            <span className="text-xs text-gray-500">/ 20</span>
          </div>
        );
      },
    },
    {
      key: 'typeEvaluation',
      label: 'Type',
      render: (value) => <Badge variant="info">{value}</Badge>,
    },
    {
      key: 'session',
      label: 'Session',
      render: (value) => (
        <Badge variant={value === 'normale' ? 'success' : 'warning'}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
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
              setSelectedNote(row);
              editModal.openModal();
            }}
            icon={Edit}
            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedNote(row);
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
          <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
          <p className="mt-2 text-gray-600">Gérer les notes des étudiants</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={FileText} onClick={bulkModal.openModal}>
            Saisie groupée
          </Button>
          <Button icon={Plus} iconPosition="left" onClick={createModal.openModal}>
            Nouvelle note
          </Button>
        </div>
      </div>

      <Card>
        <div className="space-y-4">
          <Button variant="outline" icon={Filter} onClick={() => setShowFilters(!showFilters)}>
            Filtres
          </Button>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <Select
                label="Matière"
                value={filters.filters.matiereId}
                onChange={(e) => filters.updateFilter('matiereId', e.target.value)}
                options={matiereOptions}
                placeholder="Toutes les matières"
              />
              <Select
                label="Session"
                value={filters.filters.session}
                onChange={(e) => filters.updateFilter('session', e.target.value)}
                options={[
                  { value: 'normale', label: 'Normale' },
                  { value: 'rattrapage', label: 'Rattrapage' },
                ]}
                placeholder="Toutes les sessions"
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
        <Table columns={columns} data={notes} loading={loading} emptyMessage="Aucune note trouvée" />

        {!loading && notes.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Affichage de {((pagination.page - 1) * pagination.limit) + 1} à{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total} notes
            </p>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={pagination.handlePageChange}
            />
          </div>
        )}
      </Card>

      <Modal isOpen={createModal.isOpen} onClose={createModal.closeModal} title="Nouvelle note" size="lg">
        <NoteForm onSubmit={handleCreate} onCancel={createModal.closeModal} loading={loading} />
      </Modal>

      <Modal isOpen={bulkModal.isOpen} onClose={bulkModal.closeModal} title="Saisie groupée de notes" size="xl">
        <BulkNoteForm onSubmit={handleBulkCreate} onCancel={bulkModal.closeModal} loading={loading} />
      </Modal>

      <Modal isOpen={editModal.isOpen} onClose={editModal.closeModal} title="Modifier la note" size="lg">
        <NoteForm note={selectedNote} onSubmit={handleEdit} onCancel={editModal.closeModal} loading={loading} />
      </Modal>

      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.closeModal} title="Confirmer la suppression" size="sm">
        <div className="space-y-4">
          <Alert type="warning" message="Cette action est irréversible." />
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir supprimer cette note ?
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

export default Notes;
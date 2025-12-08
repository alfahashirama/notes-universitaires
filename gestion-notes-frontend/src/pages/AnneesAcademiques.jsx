import React, { useState, useEffect } from 'react';
import { Plus, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card, Button, Modal, Table, Badge, Alert } from '@components/common';
import AnneeAcademiqueForm from '@components/annees/AnneeAcademiqueForm';
import SemestreForm from '@components/annees/SemestreForm';
import anneeAcademiqueService from '@services/anneeAcademiqueService';
import semestreService from '@services/semestreService';
import { useModal } from '@hooks';
import { formatDate } from '@utils/helpers';
import { Edit, Trash2, BookOpen } from 'lucide-react';

const AnneesAcademiques = () => {
  const [anneesAcademiques, setAnneesAcademiques] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnnee, setSelectedAnnee] = useState(null);
  const [selectedSemestre, setSelectedSemestre] = useState(null);
  const [activeTab, setActiveTab] = useState('annees');

  const createAnneeModal = useModal();
  const editAnneeModal = useModal();
  const deleteAnneeModal = useModal();
  const createSemestreModal = useModal();
  const editSemestreModal = useModal();
  const deleteSemestreModal = useModal();

  useEffect(() => {
    loadAnneesAcademiques();
    loadSemestres();
  }, []);

  const loadAnneesAcademiques = async () => {
    try {
      setLoading(true);
      const response = await anneeAcademiqueService.getAll({ limit: 100 });
      if (response.success) {
        setAnneesAcademiques(response.data);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des années académiques');
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
      toast.error('Erreur lors du chargement des semestres');
    }
  };

  // Handlers pour Années Académiques
  const handleCreateAnnee = async (data) => {
    try {
      setLoading(true);
      const response = await anneeAcademiqueService.create(data);
      if (response.success) {
        toast.success('Année académique créée avec succès');
        createAnneeModal.closeModal();
        loadAnneesAcademiques();
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAnnee = async (data) => {
    try {
      setLoading(true);
      const response = await anneeAcademiqueService.update(selectedAnnee.id, data);
      if (response.success) {
        toast.success('Année académique mise à jour avec succès');
        editAnneeModal.closeModal();
        loadAnneesAcademiques();
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnee = async () => {
    try {
      setLoading(true);
      const response = await anneeAcademiqueService.delete(selectedAnnee.id);
      if (response.success) {
        toast.success('Année académique supprimée avec succès');
        deleteAnneeModal.closeModal();
        loadAnneesAcademiques();
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  // Handlers pour Semestres
  const handleCreateSemestre = async (data) => {
    try {
      setLoading(true);
      const response = await semestreService.create(data);
      if (response.success) {
        toast.success('Semestre créé avec succès');
        createSemestreModal.closeModal();
        loadSemestres();
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSemestre = async (data) => {
    try {
      setLoading(true);
      const response = await semestreService.update(selectedSemestre.id, data);
      if (response.success) {
        toast.success('Semestre mis à jour avec succès');
        editSemestreModal.closeModal();
        loadSemestres();
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSemestre = async () => {
    try {
      setLoading(true);
      const response = await semestreService.delete(selectedSemestre.id);
      if (response.success) {
        toast.success('Semestre supprimé avec succès');
        deleteSemestreModal.closeModal();
        loadSemestres();
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  // Colonnes pour les années académiques
  const anneeColumns = [
    {
      key: 'libelle',
      label: 'Année académique',
      render: (value) => (
        <span className="font-medium text-gray-900 text-lg">{value}</span>
      ),
    },
    {
      key: 'dateDebut',
      label: 'Date de début',
      render: (value) => formatDate(value),
    },
    {
      key: 'dateFin',
      label: 'Date de fin',
      render: (value) => formatDate(value),
    },
    {
      key: 'estActive',
      label: 'Statut',
      render: (value) => (
        value ? (
          <Badge variant="success" className="flex items-center gap-1 w-fit">
            <CheckCircle className="w-4 h-4" />
            Active
          </Badge>
        ) : (
          <Badge variant="default" className="flex items-center gap-1 w-fit">
            <XCircle className="w-4 h-4" />
            Inactive
          </Badge>
        )
      ),
    },
    {
      key: 'semestres',
      label: 'Semestres',
      render: (value) => (
        <Badge variant="info">{value?.length || 0} semestre(s)</Badge>
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
              setSelectedAnnee(row);
              editAnneeModal.openModal();
            }}
            icon={Edit}
            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedAnnee(row);
              deleteAnneeModal.openModal();
            }}
            icon={Trash2}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          />
        </div>
      ),
    },
  ];

  // Colonnes pour les semestres
  const semestreColumns = [
    {
      key: 'nom',
      label: 'Nom',
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: 'numero',
      label: 'Numéro',
      render: (value) => <Badge variant="info">S{value}</Badge>,
    },
    {
      key: 'anneeAcademique',
      label: 'Année académique',
      render: (value) => (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-900">{value?.libelle}</span>
          {value?.estActive && (
            <CheckCircle className="w-4 h-4 text-green-600" />
          )}
        </div>
      ),
    },
    {
      key: 'matieres',
      label: 'Matières',
      render: (value) => (
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gray-400" />
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
              setSelectedSemestre(row);
              editSemestreModal.openModal();
            }}
            icon={Edit}
            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedSemestre(row);
              deleteSemestreModal.openModal();
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Années Académiques & Semestres</h1>
          <p className="mt-2 text-gray-600">Gérer les périodes académiques</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-8">
          <button
            onClick={() => setActiveTab('annees')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'annees'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            Années académiques
          </button>
          <button
            onClick={() => setActiveTab('semestres')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'semestres'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            Semestres
          </button>
        </nav>
      </div>

      {/* Années Académiques Tab */}
      {activeTab === 'annees' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button icon={Plus} iconPosition="left" onClick={createAnneeModal.openModal}>
              Nouvelle année académique
            </Button>
          </div>

          <Card>
            <Table
              columns={anneeColumns}
              data={anneesAcademiques}
              loading={loading}
              emptyMessage="Aucune année académique trouvée"
            />
          </Card>
        </div>
      )}

      {/* Semestres Tab */}
      {activeTab === 'semestres' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button icon={Plus} iconPosition="left" onClick={createSemestreModal.openModal}>
              Nouveau semestre
            </Button>
          </div>

          <Card>
            <Table
              columns={semestreColumns}
              data={semestres}
              loading={loading}
              emptyMessage="Aucun semestre trouvé"
            />
          </Card>
        </div>
      )}

      {/* Modals Années Académiques */}
      <Modal
        isOpen={createAnneeModal.isOpen}
        onClose={createAnneeModal.closeModal}
        title="Nouvelle année académique"
        size="lg"
      >
        <AnneeAcademiqueForm
          onSubmit={handleCreateAnnee}
          onCancel={createAnneeModal.closeModal}
          loading={loading}
        />
      </Modal>

      <Modal
        isOpen={editAnneeModal.isOpen}
        onClose={editAnneeModal.closeModal}
        title="Modifier l'année académique"
        size="lg"
      >
        <AnneeAcademiqueForm
          anneeAcademique={selectedAnnee}
          onSubmit={handleEditAnnee}
          onCancel={editAnneeModal.closeModal}
          loading={loading}
        />
      </Modal>

      <Modal
        isOpen={deleteAnneeModal.isOpen}
        onClose={deleteAnneeModal.closeModal}
        title="Confirmer la suppression"
        size="sm"
      >
        <div className="space-y-4">
          <Alert type="warning" message="Cette action supprimera également tous les semestres associés." />
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir supprimer l'année académique{' '}
            <strong>{selectedAnnee?.libelle}</strong> ?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={deleteAnneeModal.closeModal} disabled={loading}>
              Annuler
            </Button>
            <Button variant="danger" onClick={handleDeleteAnnee} loading={loading} disabled={loading}>
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modals Semestres */}
      <Modal
        isOpen={createSemestreModal.isOpen}
        onClose={createSemestreModal.closeModal}
        title="Nouveau semestre"
        size="lg"
      >
        <SemestreForm
          onSubmit={handleCreateSemestre}
          onCancel={createSemestreModal.closeModal}
          loading={loading}
        />
      </Modal>

      <Modal
        isOpen={editSemestreModal.isOpen}
        onClose={editSemestreModal.closeModal}
        title="Modifier le semestre"
        size="lg"
      >
        <SemestreForm
          semestre={selectedSemestre}
          onSubmit={handleEditSemestre}
          onCancel={editSemestreModal.closeModal}
          loading={loading}
        />
      </Modal>

      <Modal
        isOpen={deleteSemestreModal.isOpen}
        onClose={deleteSemestreModal.closeModal}
        title="Confirmer la suppression"
        size="sm"
      >
        <div className="space-y-4">
          <Alert type="warning" message="Cette action supprimera également toutes les matières associées." />
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir supprimer le semestre{' '}
            <strong>{selectedSemestre?.nom}</strong> ?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={deleteSemestreModal.closeModal} disabled={loading}>
              Annuler
            </Button>
            <Button variant="danger" onClick={handleDeleteSemestre} loading={loading} disabled={loading}>
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AnneesAcademiques;
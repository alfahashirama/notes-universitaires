import React, { useState, useEffect } from 'react';
import { Award, Users, TrendingUp } from 'lucide-react';
import { Card, Select, Button, Modal, Spinner } from '@components/common';
import BulletinEtudiant from '@components/bulletins/BulletinEtudiant';
import Classement from '@components/bulletins/Classement';
import etudiantService from '@services/etudiantService';
import semestreService from '@services/semestreService';
import departementService from '@services/departementService';
import { useModal } from '@hooks';
import { NIVEAUX } from '@utils/constants';

const Bulletins = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedEtudiant, setSelectedEtudiant] = useState('');
  const [selectedSemestre, setSelectedSemestre] = useState('');
  const [selectedDepartement, setSelectedDepartement] = useState('');
  const [selectedNiveau, setSelectedNiveau] = useState('');
  const [activeTab, setActiveTab] = useState('bulletin');

  const bulletinModal = useModal();

  useEffect(() => {
    loadSemestres();
    loadDepartements();
  }, []);

  useEffect(() => {
    if (selectedDepartement || selectedNiveau) {
      loadEtudiants();
    }
  }, [selectedDepartement, selectedNiveau]);

  const loadEtudiants = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 1000,
        ...(selectedDepartement && { departementId: selectedDepartement }),
        ...(selectedNiveau && { niveau: selectedNiveau }),
      };
      const response = await etudiantService.getAll(params);
      if (response.success) {
        setEtudiants(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSemestres = async () => {
    try {
      const response = await semestreService.getAll({ limit: 100 });
      if (response.success) {
        setSemestres(response.data);
        if (response.data.length > 0) {
          setSelectedSemestre(response.data[0].id);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des semestres:', error);
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

  const handleViewBulletin = () => {
    if (selectedEtudiant && selectedSemestre) {
      bulletinModal.openModal();
    }
  };

  const etudiantOptions = etudiants.map((etud) => ({
    value: etud.id,
    label: `${etud.matricule} - ${etud.prenom} ${etud.nom}`,
  }));

  const semestreOptions = semestres.map((sem) => ({
    value: sem.id,
    label: `${sem.nom} - ${sem.anneeAcademique?.libelle}`,
  }));

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bulletins et Classements</h1>
        <p className="mt-2 text-gray-600">Consulter les résultats et classements</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-8">
          <button
            onClick={() => setActiveTab('bulletin')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'bulletin'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Award className="w-5 h-5 inline mr-2" />
            Bulletin individuel
          </button>
          <button
            onClick={() => setActiveTab('classement')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'classement'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TrendingUp className="w-5 h-5 inline mr-2" />
            Classement
          </button>
        </nav>
      </div>

      {/* Bulletin Tab */}
      {activeTab === 'bulletin' && (
        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Sélectionner un étudiant et un semestre</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Département"
                  value={selectedDepartement}
                  onChange={(e) => setSelectedDepartement(e.target.value)}
                  options={departementOptions}
                  placeholder="Filtrer par département"
                />
                <Select
                  label="Niveau"
                  value={selectedNiveau}
                  onChange={(e) => setSelectedNiveau(e.target.value)}
                  options={niveauOptions}
                  placeholder="Filtrer par niveau"
                />
              </div>

              <Select
                label="Étudiant"
                value={selectedEtudiant}
                onChange={(e) => setSelectedEtudiant(e.target.value)}
                options={etudiantOptions}
                placeholder="Sélectionner un étudiant"
                required
              />

              <Select
                label="Semestre"
                value={selectedSemestre}
                onChange={(e) => setSelectedSemestre(e.target.value)}
                options={semestreOptions}
                placeholder="Sélectionner un semestre"
                required
              />

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleViewBulletin}
                  disabled={!selectedEtudiant || !selectedSemestre}
                  icon={Award}
                >
                  Afficher le bulletin
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Classement Tab */}
      {activeTab === 'classement' && (
        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Filtres du classement</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Semestre"
                  value={selectedSemestre}
                  onChange={(e) => setSelectedSemestre(e.target.value)}
                  options={semestreOptions}
                  placeholder="Sélectionner un semestre"
                  required
                />
                <Select
                  label="Département"
                  value={selectedDepartement}
                  onChange={(e) => setSelectedDepartement(e.target.value)}
                  options={departementOptions}
                  placeholder="Tous les départements"
                />
                <Select
                  label="Niveau"
                  value={selectedNiveau}
                  onChange={(e) => setSelectedNiveau(e.target.value)}
                  options={niveauOptions}
                  placeholder="Tous les niveaux"
                />
              </div>
            </div>
          </Card>

          {selectedSemestre && (
            <Card title="Classement général">
              <Classement
                semestreId={selectedSemestre}
                filters={{
                  ...(selectedDepartement && { departementId: selectedDepartement }),
                  ...(selectedNiveau && { niveau: selectedNiveau }),
                }}
              />
            </Card>
          )}
        </div>
      )}

      {/* Modal Bulletin */}
      <Modal
        isOpen={bulletinModal.isOpen}
        onClose={bulletinModal.closeModal}
        title=""
        size="xl"
        showCloseButton={false}
      >
        <BulletinEtudiant
          etudiantId={selectedEtudiant}
          semestreId={selectedSemestre}
          onClose={bulletinModal.closeModal}
        />
      </Modal>
    </div>
  );
};

export default Bulletins;
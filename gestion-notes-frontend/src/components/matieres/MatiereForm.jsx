import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Alert } from '@components/common';
import { validateForm } from '@utils/validators';
import semestreService from '@services/semestreService';
import enseignantService from '@services/enseignantService';
import { toast } from 'react-toastify';

const MatiereForm = ({ matiere, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    coefficient: 1,
    creditECTS: 3,
    semestreId: '',
    enseignantId: '',
  });

  const [errors, setErrors] = useState({});
  const [semestres, setSemestres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [loadingSemestres, setLoadingSemestres] = useState(false);
  const [loadingEnseignants, setLoadingEnseignants] = useState(false);

  useEffect(() => {
    loadSemestres();
    loadEnseignants();
  }, []);

  useEffect(() => {
    if (matiere) {
      setFormData({
        code: matiere.code || '',
        nom: matiere.nom || '',
        coefficient: matiere.coefficient || 1,
        creditECTS: matiere.creditECTS || 3,
        semestreId: matiere.semestreId || '',
        enseignantId: matiere.enseignantId || '',
      });
    }
  }, [matiere]);

  const loadSemestres = async () => {
    try {
      setLoadingSemestres(true);
      const response = await semestreService.getAll({ limit: 100 });
      if (response.success) {
        setSemestres(response.data);
        console.log('Semestres chargés:', response.data);
        
        if (response.data.length === 0) {
          toast.warning('Aucun semestre disponible. Veuillez créer un semestre d\'abord.');
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des semestres:', error);
      toast.error('Impossible de charger les semestres');
    } finally {
      setLoadingSemestres(false);
    }
  };

  const loadEnseignants = async () => {
    try {
      setLoadingEnseignants(true);
      const response = await enseignantService.getAll({ limit: 100 });
      if (response.success) {
        setEnseignants(response.data);
        console.log('Enseignants chargés:', response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des enseignants:', error);
      toast.error('Impossible de charger les enseignants');
    } finally {
      setLoadingEnseignants(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const rules = {
      code: {
        required: true,
        message: 'Le code est requis',
      },
      nom: {
        required: true,
        minLength: 3,
        message: 'Le nom doit contenir au moins 3 caractères',
      },
      coefficient: {
        required: true,
        min: 1,
        max: 10,
        message: 'Le coefficient doit être entre 1 et 10',
      },
      creditECTS: {
        required: true,
        min: 1,
        max: 30,
        message: 'Les crédits ECTS doivent être entre 1 et 30',
      },
      semestreId: {
        required: true,
        message: 'Le semestre est requis',
      },
    };

    return validateForm(formData, rules);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };

  const semestreOptions = semestres.map((sem) => ({
    value: sem.id,
    label: `${sem.nom} - ${sem.anneeAcademique?.libelle || 'Sans année'}`,
  }));

  const enseignantOptions = enseignants.map((ens) => ({
    value: ens.id,
    label: `${ens.prenom} ${ens.nom}`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {Object.keys(errors).length > 0 && (
        <Alert type="error" message="Veuillez corriger les erreurs dans le formulaire" />
      )}

      {semestres.length === 0 && !loadingSemestres && (
        <Alert 
          type="warning" 
          message="Aucun semestre disponible. Veuillez créer un semestre dans 'Années Académiques' avant d'ajouter une matière." 
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          error={errors.code}
          placeholder="Ex: INFO301"
          required
        />
        <Input
          label="Nom de la matière"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          error={errors.nom}
          placeholder="Ex: Base de données avancées"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Coefficient"
          type="number"
          name="coefficient"
          value={formData.coefficient}
          onChange={handleChange}
          error={errors.coefficient}
          min="1"
          max="10"
          required
        />
        <Input
          label="Crédits ECTS"
          type="number"
          name="creditECTS"
          value={formData.creditECTS}
          onChange={handleChange}
          error={errors.creditECTS}
          min="1"
          max="30"
          required
        />
      </div>

      <Select
        label="Semestre"
        name="semestreId"
        value={formData.semestreId}
        onChange={handleChange}
        options={semestreOptions}
        error={errors.semestreId}
        placeholder={loadingSemestres ? "Chargement..." : "Sélectionner un semestre"}
        required
        disabled={loadingSemestres || semestres.length === 0}
      />

      <Select
        label="Enseignant"
        name="enseignantId"
        value={formData.enseignantId}
        onChange={handleChange}
        options={enseignantOptions}
        placeholder={loadingEnseignants ? "Chargement..." : "Sélectionner un enseignant (optionnel)"}
        disabled={loadingEnseignants}
      />

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
        <Button 
          type="submit" 
          loading={loading} 
          disabled={loading || semestres.length === 0}
        >
          {matiere ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default MatiereForm;
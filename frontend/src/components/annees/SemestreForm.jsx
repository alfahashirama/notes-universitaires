import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Alert } from '@components/common';
import { validateForm } from '@utils/validators';
import anneeAcademiqueService from '@services/anneeAcademiqueService';

const SemestreForm = ({ semestre, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    nom: '',
    numero: 1,
    anneeAcademiqueId: '',
  });

  const [errors, setErrors] = useState({});
  const [anneesAcademiques, setAnneesAcademiques] = useState([]);

  useEffect(() => {
    loadAnneesAcademiques();
  }, []);

  useEffect(() => {
    if (semestre) {
      setFormData({
        nom: semestre.nom || '',
        numero: semestre.numero || 1,
        anneeAcademiqueId: semestre.anneeAcademiqueId || '',
      });
    }
  }, [semestre]);

  const loadAnneesAcademiques = async () => {
    try {
      const response = await anneeAcademiqueService.getAll({ limit: 100 });
      if (response.success) {
        setAnneesAcademiques(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des années académiques:', error);
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
      nom: {
        required: true,
        message: 'Le nom est requis',
      },
      numero: {
        required: true,
        min: 1,
        max: 10,
        message: 'Le numéro doit être entre 1 et 10',
      },
      anneeAcademiqueId: {
        required: true,
        message: 'L\'année académique est requise',
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

  const anneeOptions = anneesAcademiques.map((annee) => ({
    value: annee.id,
    label: annee.libelle,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {Object.keys(errors).length > 0 && (
        <Alert type="error" message="Veuillez corriger les erreurs dans le formulaire" />
)}
  <Input
    label="Nom du semestre"
    name="nom"
    value={formData.nom}
    onChange={handleChange}
    error={errors.nom}
    placeholder="Ex: Semestre 1"
    required
  />

  <Input
    label="Numéro"
    type="number"
    name="numero"
    value={formData.numero}
    onChange={handleChange}
    error={errors.numero}
    min="1"
    max="10"
    required
  />

  <Select
    label="Année académique"
    name="anneeAcademiqueId"
    value={formData.anneeAcademiqueId}
    onChange={handleChange}
    options={anneeOptions}
    error={errors.anneeAcademiqueId}
    placeholder="Sélectionner une année académique"
    required
  />

  <div className="flex justify-end gap-3 pt-4 border-t">
    <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
      Annuler
    </Button>
    <Button type="submit" loading={loading} disabled={loading}>
      {semestre ? 'Mettre à jour' : 'Créer'}
    </Button>
  </div>
</form>);
};
export default SemestreForm;
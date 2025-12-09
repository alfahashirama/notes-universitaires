import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Alert } from '@components/common';
import { validateNote, validateForm } from '@utils/validators';
import { TYPES_EVALUATION, SESSIONS } from '@utils/constants';
import etudiantService from '@services/etudiantService';
import matiereService from '@services/matiereService';

const NoteForm = ({ note, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    valeur: '',
    session: 'normale',
    typeEvaluation: 'Examen',
    etudiantId: '',
    matiereId: '',
  });

  const [errors, setErrors] = useState({});
  const [etudiants, setEtudiants] = useState([]);
  const [matieres, setMatieres] = useState([]);

  useEffect(() => {
    loadEtudiants();
    loadMatieres();
  }, []);

  useEffect(() => {
    if (note) {
      setFormData({
        valeur: note.valeur || '',
        session: note.session || 'normale',
        typeEvaluation: note.typeEvaluation || 'Examen',
        etudiantId: note.etudiantId || '',
        matiereId: note.matiereId || '',
      });
    }
  }, [note]);

  const loadEtudiants = async () => {
    try {
      const response = await etudiantService.getAll({ limit: 1000 });
      if (response.success) {
        setEtudiants(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants:', error);
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
      valeur: {
        required: true,
        validate: validateNote,
        message: 'La note doit être entre 0 et 20',
      },
      session: {
        required: true,
        message: 'La session est requise',
      },
      typeEvaluation: {
        required: true,
        message: 'Le type d\'évaluation est requis',
      },
      etudiantId: {
        required: true,
        message: 'L\'étudiant est requis',
      },
      matiereId: {
        required: true,
        message: 'La matière est requise',
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

  const etudiantOptions = etudiants.map((etud) => ({
    value: etud.id,
    label: `${etud.matricule} - ${etud.prenom} ${etud.nom}`,
  }));

  const matiereOptions = matieres.map((mat) => ({
    value: mat.id,
    label: `${mat.code} - ${mat.nom}`,
  }));

  const typeEvaluationOptions = TYPES_EVALUATION.map((type) => ({
    value: type,
    label: type,
  }));

  const sessionOptions = SESSIONS.map((session) => ({
    value: session,
    label: session.charAt(0).toUpperCase() + session.slice(1),
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {Object.keys(errors).length > 0 && (
        <Alert type="error" message="Veuillez corriger les erreurs dans le formulaire" />
      )}

      <Select
        label="Étudiant"
        name="etudiantId"
        value={formData.etudiantId}
        onChange={handleChange}
        options={etudiantOptions}
        error={errors.etudiantId}
        placeholder="Sélectionner un étudiant"
        required
      />

      <Select
        label="Matière"
        name="matiereId"
        value={formData.matiereId}
        onChange={handleChange}
        options={matiereOptions}
        error={errors.matiereId}
        placeholder="Sélectionner une matière"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Note (sur 20)"
          type="number"
          step="0.01"
          name="valeur"
          value={formData.valeur}
          onChange={handleChange}
          error={errors.valeur}
          placeholder="Ex: 15.5"
          min="0"
          max="20"
          required
        />

        <Select
          label="Type d'évaluation"
          name="typeEvaluation"
          value={formData.typeEvaluation}
          onChange={handleChange}
          options={typeEvaluationOptions}
          error={errors.typeEvaluation}
          required
        />

        <Select
          label="Session"
          name="session"
          value={formData.session}
          onChange={handleChange}
          options={sessionOptions}
          error={errors.session}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
        <Button type="submit" loading={loading} disabled={loading}>
          {note ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default NoteForm;
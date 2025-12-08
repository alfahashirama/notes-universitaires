import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Alert } from '@components/common';
import { validateEmail, validatePhone, validateForm } from '@utils/validators';
import departementService from '@services/departementService';

const EnseignantForm = ({ enseignant, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    specialite: '',
    departementId: '',
  });

  const [errors, setErrors] = useState({});
  const [departements, setDepartements] = useState([]);

  useEffect(() => {
    loadDepartements();
  }, []);

  useEffect(() => {
    if (enseignant) {
      setFormData({
        matricule: enseignant.matricule || '',
        nom: enseignant.nom || '',
        prenom: enseignant.prenom || '',
        email: enseignant.email || '',
        telephone: enseignant.telephone || '',
        specialite: enseignant.specialite || '',
        departementId: enseignant.departementId || '',
      });
    }
  }, [enseignant]);

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
      matricule: {
        required: true,
        message: 'Le matricule est requis',
      },
      nom: {
        required: true,
        minLength: 2,
        message: 'Le nom doit contenir au moins 2 caractères',
      },
      prenom: {
        required: true,
        minLength: 2,
        message: 'Le prénom doit contenir au moins 2 caractères',
      },
      email: {
        required: true,
        validate: validateEmail,
        message: 'Email invalide',
      },
      telephone: {
        validate: (value) => !value || validatePhone(value),
        message: 'Numéro de téléphone invalide',
      },
      departementId: {
        required: true,
        message: 'Le département est requis',
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

  const departementOptions = departements.map((dept) => ({
    value: dept.id,
    label: `${dept.nom} (${dept.code})`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {Object.keys(errors).length > 0 && (
        <Alert
          type="error"
          message="Veuillez corriger les erreurs dans le formulaire"
        />
      )}

      <Input
        label="Matricule"
        name="matricule"
        value={formData.matricule}
        onChange={handleChange}
        error={errors.matricule}
        placeholder="Ex: ENS001"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nom"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          error={errors.nom}
          placeholder="Nom de famille"
          required
        />
        <Input
          label="Prénom"
          name="prenom"
          value={formData.prenom}
          onChange={handleChange}
          error={errors.prenom}
          placeholder="Prénom"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="email@exemple.com"
          required
        />
        <Input
          label="Téléphone"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          error={errors.telephone}
          placeholder="+261 34 00 000 00"
        />
      </div>

      <Input
        label="Spécialité"
        name="specialite"
        value={formData.specialite}
        onChange={handleChange}
        error={errors.specialite}
        placeholder="Ex: Base de données, Programmation..."
      />

      <Select
        label="Département"
        name="departementId"
        value={formData.departementId}
        onChange={handleChange}
        options={departementOptions}
        error={errors.departementId}
        placeholder="Sélectionner un département"
        required
      />

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </Button>
        <Button type="submit" loading={loading} disabled={loading}>
          {enseignant ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default EnseignantForm;
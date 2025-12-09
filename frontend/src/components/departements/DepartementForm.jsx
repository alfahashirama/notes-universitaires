import React, { useState, useEffect } from 'react';
import { Input, Textarea, Button, Alert } from '@components/common';
import { validateForm } from '@utils/validators';

const DepartementForm = ({ departement, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    nom: '',
    code: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (departement) {
      setFormData({
        nom: departement.nom || '',
        code: departement.code || '',
        description: departement.description || '',
      });
    }
  }, [departement]);

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
        minLength: 3,
        message: 'Le nom doit contenir au moins 3 caractères',
      },
      code: {
        required: true,
        minLength: 2,
        maxLength: 10,
        message: 'Le code doit contenir entre 2 et 10 caractères',
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {Object.keys(errors).length > 0 && (
        <Alert type="error" message="Veuillez corriger les erreurs dans le formulaire" />
      )}

      <Input
        label="Nom du département"
        name="nom"
        value={formData.nom}
        onChange={handleChange}
        error={errors.nom}
        placeholder="Ex: Informatique"
        required
      />

      <Input
        label="Code"
        name="code"
        value={formData.code}
        onChange={handleChange}
        error={errors.code}
        placeholder="Ex: INFO"
        helperText="Code court en majuscules"
        required
      />

      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
        placeholder="Description du département..."
        rows={4}
      />

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
        <Button type="submit" loading={loading} disabled={loading}>
          {departement ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default DepartementForm;
import React, { useState, useEffect } from 'react';
import { Input, Button, Alert } from '@components/common';
import { validateForm } from '@utils/validators';

const AnneeAcademiqueForm = ({ anneeAcademique, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    libelle: '',
    dateDebut: '',
    dateFin: '',
    estActive: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (anneeAcademique) {
      setFormData({
        libelle: anneeAcademique.libelle || '',
        dateDebut: anneeAcademique.dateDebut || '',
        dateFin: anneeAcademique.dateFin || '',
        estActive: anneeAcademique.estActive || false,
      });
    }
  }, [anneeAcademique]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
      libelle: {
        required: true,
        pattern: /^\d{4}-\d{4}$/,
        message: 'Le format doit être YYYY-YYYY (ex: 2023-2024)',
      },
      dateDebut: {
        required: true,
        message: 'La date de début est requise',
      },
      dateFin: {
        required: true,
        message: 'La date de fin est requise',
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
        label="Libellé"
        name="libelle"
        value={formData.libelle}
        onChange={handleChange}
        error={errors.libelle}
        placeholder="Ex: 2023-2024"
        helperText="Format: YYYY-YYYY"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Date de début"
          type="date"
          name="dateDebut"
          value={formData.dateDebut}
          onChange={handleChange}
          error={errors.dateDebut}
          required
        />
        <Input
          label="Date de fin"
          type="date"
          name="dateFin"
          value={formData.dateFin}
          onChange={handleChange}
          error={errors.dateFin}
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="estActive"
          name="estActive"
          checked={formData.estActive}
          onChange={handleChange}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="estActive" className="ml-2 text-sm text-gray-700">
          Année académique active
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
        <Button type="submit" loading={loading} disabled={loading}>
          {anneeAcademique ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default AnneeAcademiqueForm;
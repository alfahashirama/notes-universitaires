import React, { useState, useEffect } from 'react';
import { Input, Select, Textarea, Button, Alert } from '@components/common';
import { NIVEAUX } from '@utils/constants';
import { validateEmail, validatePhone, validateForm } from '@utils/validators';
import departementService from '@services/departementService';

const EtudiantForm = ({ etudiant, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    dateNaissance: '',
    lieuNaissance: '',
    email: '',
    telephone: '',
    adresse: '',
    niveau: '',
    departementId: '',
  });

  const [errors, setErrors] = useState({});
  const [departements, setDepartements] = useState([]);

  useEffect(() => {
    loadDepartements();
  }, []);

  useEffect(() => {
    if (etudiant) {
      setFormData({
        matricule: etudiant.matricule || '',
        nom: etudiant.nom || '',
        prenom: etudiant.prenom || '',
        dateNaissance: etudiant.dateNaissance || '',
        lieuNaissance: etudiant.lieuNaissance || '',
        email: etudiant.email || '',
        telephone: etudiant.telephone || '',
        adresse: etudiant.adresse || '',
        niveau: etudiant.niveau || '',
        departementId: etudiant.departementId || '',
      });
    }
  }, [etudiant]);

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
    // Effacer l'erreur pour ce champ
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
      dateNaissance: {
        required: true,
        message: 'La date de naissance est requise',
      },
      lieuNaissance: {
        required: true,
        message: 'Le lieu de naissance est requis',
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
      niveau: {
        required: true,
        message: 'Le niveau est requis',
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

  const niveauOptions = NIVEAUX.map((niveau) => ({
    value: niveau,
    label: niveau,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {Object.keys(errors).length > 0 && (
        <Alert
          type="error"
          message="Veuillez corriger les erreurs dans le formulaire"
        />
      )}

      {/* Matricule */}
      <Input
        label="Matricule"
        name="matricule"
        value={formData.matricule}
        onChange={handleChange}
        error={errors.matricule}
        placeholder="Ex: ETU001"
        required
      />

      {/* Nom et Prénom */}
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

      {/* Date et Lieu de naissance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Date de naissance"
          type="date"
          name="dateNaissance"
          value={formData.dateNaissance}
          onChange={handleChange}
          error={errors.dateNaissance}
          required
        />
        <Input
          label="Lieu de naissance"
          name="lieuNaissance"
          value={formData.lieuNaissance}
          onChange={handleChange}
          error={errors.lieuNaissance}
          placeholder="Ville de naissance"
          required
        />
      </div>

      {/* Email et Téléphone */}
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

      {/* Adresse */}
      <Textarea
        label="Adresse"
        name="adresse"
        value={formData.adresse}
        onChange={handleChange}
        error={errors.adresse}
        placeholder="Adresse complète"
        rows={3}
      />

      {/* Niveau et Département */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Niveau"
          name="niveau"
          value={formData.niveau}
          onChange={handleChange}
          options={niveauOptions}
          error={errors.niveau}
          placeholder="Sélectionner un niveau"
          required
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
      </div>

      {/* Boutons d'action */}
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
          {etudiant ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default EtudiantForm;
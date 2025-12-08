import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building2 } from 'lucide-react';
import { useAuth } from '@hooks';
import { Button, Input, Select, Alert } from '@components/common';
import departementService from '@services/departementService';
import { USER_ROLES } from '@utils/constants';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departements, setDepartements] = useState([]);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'etudiant',
    departementId: '',
  });

  // Charger les départements
  useEffect(() => {
    loadDepartements();
  }, []);

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;
      const result = await register(dataToSend);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: USER_ROLES.ETUDIANT, label: 'Étudiant' },
    { value: USER_ROLES.ENSEIGNANT, label: 'Enseignant' },
  ];

  const departementOptions = departements.map((dept) => ({
    value: dept.id,
    label: `${dept.nom} (${dept.code})`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nom"
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder="Votre nom"
          icon={User}
          required
        />

        <Input
          label="Prénom"
          type="text"
          name="prenom"
          value={formData.prenom}
          onChange={handleChange}
          placeholder="Votre prénom"
          icon={User}
          required
        />
      </div>

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="votre.email@exemple.com"
        icon={Mail}
        required
      />

      <Select
        label="Rôle"
        name="role"
        value={formData.role}
        onChange={handleChange}
        options={roleOptions}
        required
      />

      <Select
        label="Département"
        name="departementId"
        value={formData.departementId}
        onChange={handleChange}
        options={departementOptions}
        placeholder="Sélectionner un département"
        icon={Building2}
      />

      <Input
        label="Mot de passe"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        icon={Lock}
        helperText="Au moins 6 caractères"
        required
      />

      <Input
        label="Confirmer le mot de passe"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="••••••••"
        icon={Lock}
        required
      />

      <Button
        type="submit"
        fullWidth
        loading={loading}
        disabled={loading}
      >
        S'inscrire
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Vous avez déjà un compte ?{' '}
          <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Se connecter
          </a>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
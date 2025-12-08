import React, { useState } from 'react';
import { User, Mail, Building2, Shield, Lock } from 'lucide-react';
import { useAuth } from '@hooks';
import { Card, Input, Button, Alert, Badge } from '@components/common';
import { formatDate } from '@utils/helpers';

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      setLoading(false);
      return;
    }

    try {
      const result = await updatePassword(
        passwordData.oldPassword,
        passwordData.newPassword
      );
      if (result.success) {
        setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès' });
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
        <p className="mt-2 text-gray-600">
          Gérez vos informations personnelles et la sécurité de votre compte
        </p>
      </div>

      {/* User Info Card */}
      <Card>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white text-3xl font-bold">
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.prenom} {user?.nom}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="primary" className="capitalize">
                {user?.role}
              </Badge>
              <span className="text-sm text-gray-500">
                Membre depuis {formatDate(user?.createdAt, 'MMMM yyyy')}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'profile'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Informations personnelles
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'security'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sécurité
          </button>
        </nav>
      </div>

      {/* Message */}
      {message.text && (
        <Alert
          type={message.type}
          message={message.text}
          onClose={() => setMessage({ type: '', text: '' })}
        />
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card title="Informations personnelles">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nom"
                name="nom"
                value={profileData.nom}
                onChange={handleProfileChange}
                icon={User}
                required
              />
              <Input
                label="Prénom"
                name="prenom"
                value={profileData.prenom}
                onChange={handleProfileChange}
                icon={User}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              icon={Mail}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Rôle"
                value={user?.role}
                icon={Shield}
                disabled
              />
              <Input
                label="Département"
                value={user?.departement?.nom || 'Non assigné'}
                icon={Building2}
                disabled
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card title="Changer le mot de passe">
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <Input
              label="Mot de passe actuel"
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              icon={Lock}
              required
            />

            <Input
              label="Nouveau mot de passe"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              icon={Lock}
              helperText="Au moins 6 caractères"
              required
            />

            <Input
              label="Confirmer le nouveau mot de passe"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              icon={Lock}
              required
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Mettre à jour le mot de passe
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default Profile;
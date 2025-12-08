import React, { useEffect, useState } from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  TrendingUp,
  Award,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '@hooks';
import { Card, Spinner, Badge } from '@components/common';
import etudiantService from '@services/etudiantService';
import enseignantService from '@services/enseignantService';
import matiereService from '@services/matiereService';
import noteService from '@services/noteService';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEtudiants: 0,
    totalEnseignants: 0,
    totalMatieres: 0,
    totalNotes: 0,
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);

      const [etudiants, enseignants, matieres, notes] = await Promise.all([
        etudiantService.getAll({ limit: 1 }),
        enseignantService.getAll({ limit: 1 }),
        matiereService.getAll({ limit: 1 }),
        noteService.getAll({ limit: 1 }),
      ]);

      setStats({
        totalEtudiants: etudiants.pagination?.total || 0,
        totalEnseignants: enseignants.pagination?.total || 0,
        totalMatieres: matieres.pagination?.total || 0,
        totalNotes: notes.pagination?.total || 0,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Étudiants',
      value: stats.totalEtudiants,
      icon: GraduationCap,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Enseignants',
      value: stats.totalEnseignants,
      icon: Users,
      color: 'bg-green-500',
      change: '+5%',
      changeType: 'positive',
    },
    {
      title: 'Matières',
      value: stats.totalMatieres,
      icon: BookOpen,
      color: 'bg-purple-500',
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'Notes saisies',
      value: stats.totalNotes,
      icon: FileText,
      color: 'bg-orange-500',
      change: '+23%',
      changeType: 'positive',
    },
  ];

  const quickActions = [
    {
      title: 'Ajouter un étudiant',
      description: 'Enregistrer un nouvel étudiant',
      icon: GraduationCap,
      color: 'bg-blue-50 text-blue-600',
      href: '/etudiants',
    },
    {
      title: 'Saisir des notes',
      description: 'Ajouter des notes pour une matière',
      icon: FileText,
      color: 'bg-green-50 text-green-600',
      href: '/notes',
    },
    {
      title: 'Voir les bulletins',
      description: 'Consulter les résultats',
      icon: Award,
      color: 'bg-purple-50 text-purple-600',
      href: '/bulletins',
    },
    {
      title: 'Gérer les semestres',
      description: 'Configurer les périodes',
      icon: Calendar,
      color: 'bg-orange-50 text-orange-600',
      href: '/annees-academiques',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de bord
        </h1>
        <p className="mt-2 text-gray-600">
          Bienvenue, {user?.prenom} {user?.nom} !
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} hover className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stat.value.toLocaleString()}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge
                    variant={stat.changeType === 'positive' ? 'success' : 'danger'}
                    size="sm"
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change}
                  </Badge>
                  <span className="text-xs text-gray-500">ce mois</span>
                </div>
              </div>
              <div className={`p-4 rounded-full ${stat.color}`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card title="Actions rapides">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all group"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${action.color}`}>
                <action.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600">
                {action.description}
              </p>
            </a>
          ))}
        </div>
      </Card>

      {/* Recent Activity & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card title="Activités récentes">
          <div className="space-y-4">
            {[
              {
                action: 'Nouvelle note ajoutée',
                details: 'Mathématiques - L3 Informatique',
                time: 'Il y a 2 heures',
                icon: FileText,
                color: 'text-blue-600',
              },
              {
                action: 'Étudiant inscrit',
                details: 'Jean RAKOTO - L1 Informatique',
                time: 'Il y a 5 heures',
                icon: GraduationCap,
                color: 'text-green-600',
              },
              {
                action: 'Bulletin généré',
                details: 'Semestre 1 - 2023-2024',
                time: 'Hier',
                icon: Award,
                color: 'text-purple-600',
              },
              {
                action: 'Matière créée',
                details: 'Bases de données avancées',
                time: 'Il y a 2 jours',
                icon: BookOpen,
                color: 'text-orange-600',
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.details}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Chart */}
        <Card title="Statistiques mensuelles">
          <div className="h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p>Graphique des statistiques</p>
              <p className="text-sm mt-2">
                À implémenter avec une bibliothèque de graphiques
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card title="Événements à venir">
        <div className="space-y-3">
          {[
            {
              title: 'Fin de saisie des notes - Semestre 1',
              date: '15 Décembre 2024',
              type: 'deadline',
            },
            {
              title: 'Délibération - L3 Informatique',
              date: '20 Décembre 2024',
              type: 'meeting',
            },
            {
              title: 'Début des examens - Semestre 2',
              date: '5 Janvier 2025',
              type: 'exam',
            },
          ].map((event, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {event.title}
                  </h4>
                  <p className="text-sm text-gray-600">{event.date}</p>
                </div>
              </div>
              <Badge variant="info">{event.type}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  Award,
  Building2,
  Calendar,
  X,
} from 'lucide-react';
import { useAuth } from '@hooks';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user, hasRole } = useAuth();

  const menuItems = [
    {
      name: 'Tableau de bord',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'enseignant', 'etudiant', 'scolarite'],
    },
    {
      name: 'Étudiants',
      path: '/etudiants',
      icon: GraduationCap,
      roles: ['admin', 'enseignant', 'scolarite'],
    },
    {
      name: 'Enseignants',
      path: '/enseignants',
      icon: Users,
      roles: ['admin', 'scolarite'],
    },
    {
      name: 'Matières',
      path: '/matieres',
      icon: BookOpen,
      roles: ['admin', 'enseignant', 'scolarite'],
    },
    {
      name: 'Notes',
      path: '/notes',
      icon: FileText,
      roles: ['admin', 'enseignant', 'scolarite'],
    },
    {
      name: 'Bulletins',
      path: '/bulletins',
      icon: Award,
      roles: ['admin', 'enseignant', 'etudiant', 'scolarite'],
    },
    {
      name: 'Départements',
      path: '/departements',
      icon: Building2,
      roles: ['admin', 'scolarite'],
    },
    {
      name: 'Années & Semestres',
      path: '/annees-academiques',
      icon: Calendar,
      roles: ['admin', 'scolarite'],
    },
  ];

  // Filtrer les items en fonction du rôle
  const filteredMenuItems = menuItems.filter((item) =>
    hasRole(item.roles)
  );

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen pt-20 transition-transform duration-300
          bg-white border-r border-gray-200 w-64
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Bouton fermer pour mobile */}
        <button
          onClick={closeSidebar}
          className="absolute top-4 right-4 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Navigation */}
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {filteredMenuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors group ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 transition-colors" />
                  <span className="ml-3">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Informations utilisateur en bas */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-semibold text-sm">
                  {user?.prenom?.[0]}{user?.nom?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
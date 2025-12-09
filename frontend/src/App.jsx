import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from '@context/AuthContext';
import { Layout } from '@components/layout';
import { PrivateRoute } from '@components/auth';

// Pages
import {
  Login,
  Register,
  Dashboard,
  Profile,
  NotFound,
  Etudiants,
  Enseignants,
  Matieres,
  Notes,
  Departements,
  Bulletins,
  AnneesAcademiques,
} from '@pages';

import { TOAST_CONFIG } from '@utils/constants';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Routes protégées avec Layout */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="etudiants" element={<Etudiants />} />
              <Route path="enseignants" element={<Enseignants />} />
              <Route path="matieres" element={<Matieres />} />
              <Route path="notes" element={<Notes />} />
              <Route path="bulletins" element={<Bulletins />} />
              <Route path="departements" element={<Departements />} />
              <Route path="annees-academiques" element={<AnneesAcademiques />} />
              <Route path="settings" element={
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Paramètres</h2>
                  <p className="text-gray-600">Configuration du compte et préférences</p>
                </div>
              } />
            </Route>

            {/* Route 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <ToastContainer {...TOAST_CONFIG} />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
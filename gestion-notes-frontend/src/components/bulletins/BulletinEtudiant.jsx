import React, { useState, useEffect } from 'react';
import { Download, Printer, X } from 'lucide-react';
import { Button, Badge, Spinner, Card } from '@components/common';
import bulletinService from '@services/bulletinService';
import { formatDate, getMention } from '@utils/helpers';

const BulletinEtudiant = ({ etudiantId, semestreId, onClose }) => {
  const [bulletin, setBulletin] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (etudiantId && semestreId) {
      loadBulletin();
    }
  }, [etudiantId, semestreId]);

  const loadBulletin = async () => {
    try {
      setLoading(true);
      const response = await bulletinService.getBulletinEtudiant(etudiantId, semestreId);
      if (response.success) {
        setBulletin(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du bulletin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" text="Chargement du bulletin..." />
      </div>
    );
  }

  if (!bulletin) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucun bulletin disponible</p>
      </div>
    );
  }

  const mention = getMention(bulletin.statistiques.moyenneGenerale);

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex items-center justify-between pb-6 border-b print:hidden">
        <h3 className="text-2xl font-bold text-gray-900">Bulletin de notes</h3>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={Download} size="sm">
            Télécharger
          </Button>
          <Button variant="outline" icon={Printer} size="sm" onClick={handlePrint}>
            Imprimer
          </Button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* En-tête du bulletin */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6 rounded-lg">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium opacity-90 mb-2">Étudiant</h4>
            <p className="text-xl font-bold">{bulletin.etudiant.nomComplet}</p>
            <p className="text-sm opacity-90 mt-1">Matricule: {bulletin.etudiant.matricule}</p>
            <p className="text-sm opacity-90">Niveau: {bulletin.etudiant.niveau}</p>
            <p className="text-sm opacity-90">Département: {bulletin.etudiant.departement?.nom}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium opacity-90 mb-2">Période</h4>
            <p className="text-xl font-bold">{bulletin.semestre.nom}</p>
            <p className="text-sm opacity-90 mt-1">
              Année: {bulletin.semestre.anneeAcademique?.libelle}
            </p>
          </div>
        </div>
      </div>

      {/* Tableau des résultats */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matière
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coef.
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ECTS
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Moyenne
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bulletin.resultats.map((resultat, index) => {
                const matiereValide = parseFloat(resultat.moyenne) >= 10;
                return (
                  <tr key={index} className={matiereValide ? '' : 'bg-red-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{resultat.matiere.nom}</p>
                        <p className="text-sm text-gray-500">{resultat.matiere.code}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge variant="info">{resultat.matiere.coefficient}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge variant="success">{resultat.matiere.creditECTS}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`text-lg font-bold ${matiereValide ? 'text-green-600' : 'text-red-600'}`}>
                        {resultat.moyenne}
                      </span>
                      <span className="text-sm text-gray-500"> / 20</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {resultat.estValide ? (
                        <Badge variant="success">Validé</Badge>
                      ) : (
                        <Badge variant="danger">Ajourné</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-sm text-gray-600 mb-2">Moyenne Générale</p>
          <p className={`text-4xl font-bold ${mention.color}`}>
            {bulletin.statistiques.moyenneGenerale}
          </p>
          <p className="text-xs text-gray-500 mt-1">/ 20</p>
        </Card>

        <Card className="text-center">
          <p className="text-sm text-gray-600 mb-2">Mention</p>
          <p className={`text-2xl font-bold ${mention.color}`}>{mention.label}</p>
        </Card>

        <Card className="text-center">
          <p className="text-sm text-gray-600 mb-2">Crédits obtenus</p>
          <p className="text-4xl font-bold text-primary-600">
            {bulletin.statistiques.creditsObtenus}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            sur {bulletin.statistiques.totalCredits}
          </p>
        </Card>

        <Card className="text-center">
          <p className="text-sm text-gray-600 mb-2">Taux de réussite</p>
          <p className="text-4xl font-bold text-green-600">
            {bulletin.statistiques.tauxReussite}
          </p>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pt-6 border-t print:block">
        <p>Bulletin édité le {formatDate(new Date())}</p>
        <p className="mt-2">Université - Système de Gestion des Notes</p>
      </div>
    </div>
  );
};

export default BulletinEtudiant;
import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button, Select, Input, Alert } from '@components/common';
import { TYPES_EVALUATION, SESSIONS } from '@utils/constants';
import etudiantService from '@services/etudiantService';
import matiereService from '@services/matiereService';

const BulkNoteForm = ({ onSubmit, onCancel, loading }) => {
  const [notes, setNotes] = useState([
    { etudiantId: '', valeur: '', typeEvaluation: 'Examen', session: 'normale' }
  ]);
  const [matiereId, setMatiereId] = useState('');
  const [etudiants, setEtudiants] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadEtudiants();
    loadMatieres();
  }, []);

  const loadEtudiants = async () => {
    try {
      const response = await etudiantService.getAll({ limit: 1000 });
      if (response.success) {
        setEtudiants(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants:', error);
    }
  };

  const loadMatieres = async () => {
    try {
      const response = await matiereService.getAll({ limit: 1000 });
      if (response.success) {
        setMatieres(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des matières:', error);
    }
  };

  const handleAddNote = () => {
    setNotes([...notes, { etudiantId: '', valeur: '', typeEvaluation: 'Examen', session: 'normale' }]);
  };

  const handleRemoveNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const handleNoteChange = (index, field, value) => {
    const updatedNotes = [...notes];
    updatedNotes[index][field] = value;
    setNotes(updatedNotes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!matiereId) {
      setErrors({ matiere: 'Veuillez sélectionner une matière' });
      return;
    }

    const notesData = notes.map(note => ({
      ...note,
      matiereId,
      valeur: parseFloat(note.valeur)
    }));

    onSubmit(notesData);
  };

  const etudiantOptions = etudiants.map((etud) => ({
    value: etud.id,
    label: `${etud.matricule} - ${etud.prenom} ${etud.nom}`,
  }));

  const matiereOptions = matieres.map((mat) => ({
    value: mat.id,
    label: `${mat.code} - ${mat.nom}`,
  }));

  const typeEvaluationOptions = TYPES_EVALUATION.map((type) => ({
    value: type,
    label: type,
  }));

  const sessionOptions = SESSIONS.map((session) => ({
    value: session,
    label: session.charAt(0).toUpperCase() + session.slice(1),
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.matiere && <Alert type="error" message={errors.matiere} />}

      <Select
        label="Matière"
        value={matiereId}
        onChange={(e) => setMatiereId(e.target.value)}
        options={matiereOptions}
        placeholder="Sélectionner une matière"
        required
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Notes des étudiants</h3>
          <Button type="button" size="sm" icon={Plus} onClick={handleAddNote}>
            Ajouter
          </Button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notes.map((note, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="col-span-5">
                <Select
                  value={note.etudiantId}
                  onChange={(e) => handleNoteChange(index, 'etudiantId', e.target.value)}
                  options={etudiantOptions}
                  placeholder="Étudiant"
                  required
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  step="0.01"
                  value={note.valeur}
                  onChange={(e) => handleNoteChange(index, 'valeur', e.target.value)}
                  placeholder="Note"
                  min="0"
                  max="20"
                  required
                />
              </div>
              <div className="col-span-2">
                <Select
                  value={note.typeEvaluation}
                  onChange={(e) => handleNoteChange(index, 'typeEvaluation', e.target.value)}
                  options={typeEvaluationOptions}
                  required
                />
              </div>
              <div className="col-span-2">
                <Select
                  value={note.session}
                  onChange={(e) => handleNoteChange(index, 'session', e.target.value)}
                  options={sessionOptions}
                  required
                />
              </div>
              <div className="col-span-1 flex items-center">
                {notes.length > 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    icon={Trash2}
                    onClick={() => handleRemoveNote(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
        <Button type="submit" loading={loading} disabled={loading}>
          Créer {notes.length} note(s)
        </Button>
      </div>
    </form>
  );
};

export default BulkNoteForm;
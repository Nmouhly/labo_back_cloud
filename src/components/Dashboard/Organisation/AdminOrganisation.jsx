import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminOrganisation = () => {
  const [equipes, setEquipes] = useState([]);
  const [newEquipe, setNewEquipe] = useState({ name: '', specialization: '', description: '' });
  const [editEquipe, setEditEquipe] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch all existing equipes when the component mounts
    axios.get('http://localhost:8000/api/equipe')
      .then(response => setEquipes(response.data))
      .catch(error => console.error('Error fetching equipes', error));
  }, []);

  const handleCreate = () => {
    axios.post('http://localhost:8000/api/equipe', newEquipe)
      .then(response => {
        setEquipes([...equipes, response.data]);
        setNewEquipe({ name: '', specialization: '', description: '' });
      })
      .catch(error => console.error('Error creating equipe', error));
  };

  const handleUpdate = (id) => {
    axios.put(`http://localhost:8000/api/equipe/${id}`, editEquipe)
      .then(response => {
        setEquipes(equipes.map(e => e.id === id ? response.data : e));
        setEditEquipe(null);
        setIsEditing(false);
      })
      .catch(error => console.error('Error updating equipe', error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/api/equipe/${id}`)
      .then(() => {
        setEquipes(equipes.filter(e => e.id !== id));
      })
      .catch(error => console.error('Error deleting equipe', error));
  };

  const startEditing = (equipeItem) => {
    setEditEquipe(equipeItem);
    setIsEditing(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Gestion des Équipes</h1>
      
      {/* Create Form */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Ajouter une équipe</h2>
        <input
          type="text"
          placeholder="Nom"
          value={newEquipe.name}
          onChange={(e) => setNewEquipe({ ...newEquipe, name: e.target.value })}
          className="border border-gray-300 rounded p-2 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Spécialisation"
          value={newEquipe.specialization}
          onChange={(e) => setNewEquipe({ ...newEquipe, specialization: e.target.value })}
          className="border border-gray-300 rounded p-2 mb-2 w-full"
        />
        <textarea
          placeholder="Description"
          value={newEquipe.description}
          onChange={(e) => setNewEquipe({ ...newEquipe, description: e.target.value })}
          className="border border-gray-300 rounded p-2 mb-2 w-full"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Ajouter
        </button>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Modifier une équipe</h2>
          <input
            type="text"
            placeholder="Nom"
            value={editEquipe.name}
            onChange={(e) => setEditEquipe({ ...editEquipe, name: e.target.value })}
            className="border border-gray-300 rounded p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Spécialisation"
            value={editEquipe.specialization}
            onChange={(e) => setEditEquipe({ ...editEquipe, specialization: e.target.value })}
            className="border border-gray-300 rounded p-2 mb-2 w-full"
          />
          <textarea
            placeholder="Description"
            value={editEquipe.description}
            onChange={(e) => setEditEquipe({ ...editEquipe, description: e.target.value })}
            className="border border-gray-300 rounded p-2 mb-2 w-full"
          />
          <button
            onClick={() => handleUpdate(editEquipe.id)}
            className="bg-green-500 text-white p-2 rounded mr-2"
          >
            Mettre à jour
          </button>
          <button
            onClick={() => { setEditEquipe(null); setIsEditing(false); }}
            className="bg-gray-500 text-white p-2 rounded"
          >
            Annuler
          </button>
        </div>
      )}

      {/* Display Equipes */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Liste des équipes</h2>
        <ul>
          {equipes.map(e => (
            <li key={e.id} className="bg-white border border-gray-300 rounded p-4 mb-2 shadow-md">
              <h3 className="text-xl font-bold mb-2">{e.name}</h3>
              <p className="text-gray-700 mb-2">Spécialisation: {e.specialization}</p>
              <p className="mb-2">{e.description}</p>
              <button
                onClick={() => startEditing(e)}
                className="bg-yellow-500 text-white p-2 rounded mr-2"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(e.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminOrganisation;

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';
import ReactQuill from 'react-quill'; // Import React Quill
import 'react-quill/dist/quill.snow.css'; // Import the CSS for React Quill

const EquipeCreat = () => {
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [description, setDescription] = useState(''); // Will hold the rich text content
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/equipe', {
        name,
        specialization,
        description, // Send rich text content
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('Équipe créée:', response.data);
      toast.success('Équipe créée avec succès');
      navigate('/dashboard/equipe');
    } catch (error) {
      console.error('Erreur lors de la création de l\'équipe:', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        } : 'Aucune réponse disponible',
        config: error.config,
      });
      setError('Erreur lors de la création de l\'équipe');
      toast.error('Erreur lors de la création de l\'équipe');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Créer une Nouvelle Équipe</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Spécialisation</label>
          <input 
            type="text" 
            value={specialization} 
            onChange={(e) => setSpecialization(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <ReactQuill 
            value={description} 
            onChange={setDescription} // Set the description using ReactQuill's onChange
            className="w-full border border-gray-300 rounded"
          />
        </div>
        <button 
            type="submit" 
            className="bg-green-500 text-white py-1 px-4  rounded hover:bg-green-600"
            >
            Ajouter
          </button>
      </form>
    </div>
  );
};

export default EquipeCreat;

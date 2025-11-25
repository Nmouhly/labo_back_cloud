import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const EquipeEdit = () => {
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const { accessToken } = useContext(AuthContext);

  // Récupérer les détails de l'équipe à modifier
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/equipe/${id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setName(response.data.name);
        setSpecialization(response.data.specialization);
        setDescription(response.data.description);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'équipe:', error);
        toast.error('Erreur lors de la récupération de l\'équipe');
      }
    };

    fetchTeam();
  }, [id, accessToken]);

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:8000/api/equipe/${id}`, {
        name,
        specialization,
        description,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('Équipe modifiée:', response.data);
      toast.success('Équipe modifiée avec succès');
      navigate('/dashboard/equipe');
    } catch (error) {
      console.error('Erreur lors de la modification de l\'équipe:', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        } : 'Aucune réponse disponible',
        config: error.config
      });
      setError('Erreur lors de la modification de l\'équipe');
      toast.error('Erreur lors de la modification de l\'équipe');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Modifier l'Équipe</h1>
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
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Mettre à jour
                </button>
      </form>
    </div>
  );
};

export default EquipeEdit;

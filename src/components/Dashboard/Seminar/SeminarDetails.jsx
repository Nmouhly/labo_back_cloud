import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const SeminarDetails = () => {
  const { id } = useParams();
  const [seminar, setSeminar] = useState({
    title: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    speaker: '',
    status: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchSeminar = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/seminars/${id}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        const data = response.data;
        setSeminar({
          ...data,
          start_time: data.start_time.slice(0, 5), // Ensure HH:mm format
          end_time: data.end_time.slice(0, 5),     // Ensure HH:mm format
        });
      } catch (error) {
        console.error('Erreur lors du chargement des informations du séminaire', error);
        toast.error(`Erreur lors du chargement des informations du séminaire: ${error.response?.data?.message || error.message}`);
      }
    };
    fetchSeminar();
  }, [id, accessToken]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Submitting seminar:', seminar); // Log the seminar object
    console.log('Start Time:', seminar.start_time); // Log start_time
    console.log('End Time:', seminar.end_time); // Log end_time
  
    // Ensure time fields are in the correct format
    if (!/^\d{2}:\d{2}$/.test(seminar.start_time)) {
      setError('Heure de début doit être au format HH:mm');
      return;
    }
    if (!/^\d{2}:\d{2}$/.test(seminar.end_time)) {
      setError('Heure de fin doit être au format HH:mm');
      return;
    }
  
    try {
      const response = await axios.put(`http://localhost:8000/api/seminars/${id}`, seminar, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      toast.success('Séminaire mis à jour avec succès');
      navigate('/dashboard/SeminarList');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du séminaire', error);
      if (error.response && error.response.data.errors) {
        console.error('Validation Errors:', error.response.data.errors);
        setError('Les données soumises sont invalides. Vérifiez les champs suivants: ' + JSON.stringify(error.response.data.errors));
      }
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeminar({
      ...seminar,
      [name]: value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Modifier le Séminaire</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input 
            type="text" 
            name="title" 
            value={seminar.title} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea 
            name="description" 
            value={seminar.description} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {/* Date Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input 
            type="date" 
            name="date" 
            value={seminar.date} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {/* Start Time Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Heure de début</label>
          <input 
            type="time" 
            name="start_time" 
            value={seminar.start_time} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {/* End Time Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Heure de fin</label>
          <input 
            type="time" 
            name="end_time" 
            value={seminar.end_time} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {/* Location Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Lieu</label>
          <input 
            type="text" 
            name="location" 
            value={seminar.location} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {/* Speaker Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Intervenant</label>
          <input 
            type="text" 
            name="speaker" 
            value={seminar.speaker} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        {/* Status Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Statut</label>
          <select 
            name="status" 
            value={seminar.status} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Sélectionner un statut</option>
            <option value="prevu">Prévu</option>
            <option value="passe">Passé</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Mettre à jour
                </button>
      </form>
    </div>
  );
};

export default SeminarDetails;

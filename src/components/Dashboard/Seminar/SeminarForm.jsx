import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const SeminarForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  // Fonction pour vérifier la date et définir le statut
  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialiser l'heure de la date actuelle à minuit pour une comparaison juste

    setDate(e.target.value);

    // Si la date sélectionnée est dans le passé, définir automatiquement le statut sur "passé"
    if (selectedDate < today) {
      setStatus('passe');
    } else {
      setStatus('prevu'); // Si la date est future ou aujourd'hui, statut par défaut "prévu"
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const seminarData = {
      title,
      description,
      date,
      start_time: startTime,
      end_time: endTime,
      location,
      speaker,
      status,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/seminars', seminarData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('Séminaire ajouté:', response.data);
      toast.success('Séminaire ajouté avec succès');
      navigate('/dashboard/SeminarList');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du séminaire:', error);
      setError('Erreur lors de l\'ajout du séminaire');
      toast.error('Erreur lors de l\'ajout du séminaire');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ajouter un Séminaire</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={handleDateChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Heure de Début</label>
          <input 
            type="time" 
            value={startTime} 
            onChange={(e) => setStartTime(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Heure de Fin</label>
          <input 
            type="time" 
            value={endTime} 
            onChange={(e) => setEndTime(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lieu</label>
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Intervenant</label>
          <input 
            type="text" 
            value={speaker} 
            onChange={(e) => setSpeaker(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Statut</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="prevu">Prévu</option>
            <option value="passe">Passé</option>
          </select>
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

export default SeminarForm;

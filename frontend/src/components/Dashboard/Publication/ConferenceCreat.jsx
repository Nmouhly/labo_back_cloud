import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const ConferenceCreate = () => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState(''); // État pour gérer l'image
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext); // Récupération du token d'accès

    const handleSubmit = async (e) => {
        e.preventDefault();

        const conferenceData = {
            title,
            date,
            location,
            image,
        };

        try {
            const response = await axios.post('http://localhost:8000/api/conferences', conferenceData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            toast.success('Conférence ajoutée avec succès');
            navigate('/dashboard/conference'); // Redirige vers la page des conférences
        } catch (error) {
            setError('Erreur lors de l\'ajout de la conférence');
            toast.error('Erreur lors de l\'ajout de la conférence');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result); // Convertir l'image en base64
        };
        if (file) {
            reader.readAsDataURL(file); // Lire le fichier sélectionné
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Ajouter une Conférence</h1>
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
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
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
                    <label className="block text-sm font-medium mb-1">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange} // Gestion de la sélection de l'image
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button 
                    type="submit" 
                    className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
                >
                    Ajouter
                </button>
            </form>
        </div>
    );
};

export default ConferenceCreate;

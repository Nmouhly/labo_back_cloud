// src/components/JobOffer/JobOfferCreate.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const JobOfferCreate = () => {
    const [jobOffer, setJobOffer] = useState({
        title: '',
        description: '',
        requirements: '',
        location: '',
        salary: '',
        deadline: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/job-offers', jobOffer, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log('Offre d\'emploi créée:', response.data);
            toast.success('Offre d\'emploi créée avec succès');
            navigate('/dashboard/JobOffer');
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const validationErrors = error.response.data.errors;
                console.error('Erreurs de validation:', validationErrors);
                setError('Erreur de validation : ' + Object.values(validationErrors).flat().join(', '));
            } else {
                console.error('Erreur lors de la création de l\'offre d\'emploi', error);
                setError('Erreur lors de la création de l\'offre d\'emploi');
            }
            toast.error('Erreur lors de la création de l\'offre d\'emploi');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobOffer({
            ...jobOffer,
            [name]: value
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Ajouter une Offre d'Emploi</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Titre</label>
                    <input
                        type="text"
                        name="title"
                        value={jobOffer.title}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={jobOffer.description}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Exigences</label>
                    <textarea
                        name="requirements"
                        value={jobOffer.requirements}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Lieu</label>
                    <input
                        type="text"
                        name="location"
                        value={jobOffer.location}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Salaire</label>
                    <input
                        type="number"
                        step="0.01"
                        name="salary"
                        value={jobOffer.salary}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Date Limite</label>
                    <input
                        type="date"
                        name="deadline"
                        value={jobOffer.deadline}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
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

export default JobOfferCreate;

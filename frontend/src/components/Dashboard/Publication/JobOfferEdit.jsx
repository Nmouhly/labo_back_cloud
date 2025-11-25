// src/components/JobOffer/JobOfferEdit.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const JobOfferEdit = () => {
    const { id } = useParams();
    const [jobOffer, setJobOffer] = useState({
        title: '',
        description: '',
        requirements: '',
        location: '',
        salary: '',
        application_deadline: '',
        pdf_link: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        const fetchJobOffer = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/job-offers/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setJobOffer(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement des informations de l\'offre d\'emploi', error);
                toast.error('Erreur lors du chargement des informations de l\'offre d\'emploi');
            }
        };
        fetchJobOffer();
    }, [id, accessToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8000/api/job-offers/${id}`, jobOffer, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log('Offre d\'emploi mise à jour:', response.data);
            toast.success('Offre d\'emploi mise à jour avec succès');
            navigate('/dashboard/JobOffer');
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const validationErrors = error.response.data.errors;
                console.error('Erreurs de validation:', validationErrors);
                setError('Erreur de validation : ' + Object.values(validationErrors).flat().join(', '));
            } else {
                console.error('Erreur lors de la mise à jour de l\'offre d\'emploi', error);
                setError('Erreur lors de la mise à jour de l\'offre d\'emploi');
            }
            toast.error('Erreur lors de la mise à jour de l\'offre d\'emploi');
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
            <h1 className="text-2xl font-bold mb-4">Modifier l'Offre d'Emploi</h1>
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
                        rows="4"
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
                        rows="4"
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
                        name="salary"
                        value={jobOffer.salary}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Date Limite de Candidature</label>
                    <input
                        type="date"
                        name="application_deadline"
                        value={jobOffer.application_deadline}
                        onChange={handleChange}
                        required
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

export default JobOfferEdit;

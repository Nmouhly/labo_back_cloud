// src/components/Patent/PatentCreate.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const PatentCreate = () => {
    const [patent, setPatent] = useState({
        title: '',
        author: '',
        filing_date: '',
        pdf_link: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/patents', patent, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log('Brevet créé:', response.data);
            toast.success('Brevet créé avec succès');
            navigate('/dashboard/patent');
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const validationErrors = error.response.data.errors;
                console.error('Erreurs de validation:', validationErrors);
                setError('Erreur de validation : ' + Object.values(validationErrors).flat().join(', '));
            } else {
                console.error('Erreur lors de la création du brevet', error);
                setError('Erreur lors de la création du brevet');
            }
            toast.error('Erreur lors de la création du brevet');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatent({
            ...patent,
            [name]: value
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Ajouter un Brevet</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Titre</label>
                    <input
                        type="text"
                        name="title"
                        value={patent.title}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Auteur</label>
                    <input
                        type="text"
                        name="author"
                        value={patent.author}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Date de Dépôt</label>
                    <input
                        type="date"
                        name="filing_date"
                        value={patent.filing_date}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Lien PDF</label>
                    <input
                        type="url"
                        name="pdf_link"
                        value={patent.pdf_link}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Créer
                </button>
            </form>
        </div>
    );
};

export default PatentCreate;

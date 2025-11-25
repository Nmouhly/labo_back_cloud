// src/components/Patent/PatentAdmin.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const PatentAdmin = () => {
    const [patents, setPatents] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchPatents();
    }, [accessToken]);

    const fetchPatents = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/brevetsAdmin', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setPatents(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des brevets', error);
            setError('Erreur lors de la récupération des brevets');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce brevet ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/patents/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setPatents(patents.filter(patent => patent.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression du brevet', error);
                setError('Erreur lors de la suppression du brevet');
            }
        }
    };

    return (
        <div>
            <h1>Gestion des Brevets</h1>
            <p>hiiiiiiiii</p>
            <Link to="/dashboard/PatentCreate" className="btn btn-primary mb-4">Ajouter un Brevet</Link>
            {error && <p className="text-red-500">{error}</p>}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de Dépôt</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lien PDF</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {patents.length ? (
                        patents.map(patent => (
                            <tr key={patent.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{patent.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{patent.author}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(patent.filing_date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {patent.pdf_link ? (
                                        <a href={patent.pdf_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                            Voir le PDF
                                        </a>
                                    ) : (
                                        'Pas de lien'
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/dashboard/PatentEdit/${patent.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                    <button onClick={() => handleDelete(patent.id)} className="btn btn-danger mb-2">Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-4">Aucun brevet disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PatentAdmin;

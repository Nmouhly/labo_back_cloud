import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const EquipeAdmin = () => {
    const [equipes, setEquipes] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);
    const [expandedDescription, setExpandedDescription] = useState({}); // State for expanded descriptions

    useEffect(() => {
        fetchEquipes();
    }, [accessToken]);

    const fetchEquipes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/equipe', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setEquipes(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des équipes', error);
            setError('Erreur lors de la récupération des équipes');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/equipe/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setEquipes(equipes.filter(equipe => equipe.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'équipe', error);
                setError('Erreur lors de la suppression de l\'équipe');
            }
        }
    };

    // Fonction pour supprimer les balises HTML et n'afficher que le texte brut
    const stripHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    };

    const toggleDescription = (id) => {
        setExpandedDescription(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    return (
        <div className="container mt-4">
            <h1>Gestion des Équipes</h1>
            <Link to="/dashboard/EquipeCreate" className="btn btn-primary mb-4">Ajouter une Équipe</Link>
            {error && <div className="alert alert-danger">{error}</div>}
            <table className="table table-striped">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">Nom</th>
                        <th scope="col">Spécialisation</th>
                        <th scope="col">Description</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {equipes.length ? (
                        equipes.map(equipe => (
                            <tr key={equipe.id}>
                                <td>{equipe.name}</td>
                                <td>{equipe.specialization}</td>
                                <td>
                                    <div>
                                        {expandedDescription[equipe.id] 
                                            ? stripHtml(equipe.description) // Affiche le texte brut complet
                                            : `${stripHtml(equipe.description).substring(0, 50)}...`} {/* Affiche une partie du texte brut */}
                                        {stripHtml(equipe.description).length > 50 && (
                                            <button 
                                                className="btn btn-link p-0" 
                                                onClick={() => toggleDescription(equipe.id)}>
                                                {expandedDescription[equipe.id] ? 'Lire moins' : 'Lire suite'}
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <Link to={`/dashboard/EquipeEdit/${equipe.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                    <button onClick={() => handleDelete(equipe.id)} className="btn btn-danger mb-2">Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">Aucune équipe disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EquipeAdmin;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';

// Fonction pour enlever les balises HTML
const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

// Fonction pour tronquer le texte
const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

const PresentationAdmin = () => {
    const [presentations, setPresentations] = useState([]);
    const [teams, setTeams] = useState([]); // Nouvel état pour les équipes
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);
    const [expandedContent, setExpandedContent] = useState(null); // État pour gérer les contenus développés
    const [expandedTitle, setExpandedTitle] = useState(null); // État pour gérer les titres développés

    useEffect(() => {
        fetchPresentations();
        fetchTeams(); // Appel à la récupération des équipes
    }, [accessToken]);

    const fetchPresentations = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/presentations', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (Array.isArray(response.data)) {
                setPresentations(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau', response.data);
                setError('Erreur de données : Les données reçues ne sont pas un tableau');
            }
        } catch (error) {
            const errorMessage = error.response 
                ? (error.response.data.message || 'Erreur inconnue du serveur') + ' - Code: ' + error.response.status
                : error.message || 'Erreur inconnue';
            console.error('Erreur lors de la récupération des présentations', errorMessage);
            setError('Erreur lors de la récupération des présentations : ' + errorMessage);
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/equipe', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (Array.isArray(response.data)) {
                setTeams(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau', response.data);
                setError('Erreur de données : Les données reçues ne sont pas un tableau');
            }
        } catch (error) {
            const errorMessage = error.response 
                ? (error.response.data.message || 'Erreur inconnue du serveur') + ' - Code: ' + error.response.status
                : error.message || 'Erreur inconnue';
            console.error('Erreur lors de la récupération des équipes', errorMessage);
            setError('Erreur lors de la récupération des équipes : ' + errorMessage);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette présentation ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/presentations/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setPresentations(presentations.filter(presentation => presentation.id !== id));
                toast.success('Présentation supprimée avec succès');
            } catch (error) {
                console.error('Erreur lors de la suppression de la présentation', error);
                toast.error('Erreur lors de la suppression de la présentation');
            }
        }
    };

    const toggleExpandContent = (id) => {
        setExpandedContent(expandedContent === id ? null : id);
    };

    const toggleExpandTitle = (id) => {
        setExpandedTitle(expandedTitle === id ? null : id);
    };

    // Fonction pour obtenir le nom de l'équipe à partir de l'id
    const getTeamNameById = (id) => {
        const team = teams.find(team => team.id === id);
        return team ? team.name : 'Inconnu';
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Gestion de la Présentation de l’Équipe</h1>
                <Link to="/dashboard/PresentationCreate"  className="btn btn-primary mb-4">Ajouter une Présentation</Link>
            
            {error && <p className="text-danger">{error}</p>}

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th className="text-center">Titre</th>
                            <th className="text-center">Contenu</th>
                            <th className="text-center">Équipe</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {presentations.length ? (
                            presentations.map(presentation => (
                                <tr key={presentation.id}>
                                    <td className="align-middle">
                                        {expandedTitle === presentation.id ? 
                                            stripHtmlTags(presentation.title) 
                                            : truncateText(stripHtmlTags(presentation.title), 30)} {/* Longueur du titre tronqué à 30 caractères */}
                                       
                                    </td>
                                    <td className="align-middle">
                                        {expandedContent === presentation.id ? 
                                            stripHtmlTags(presentation.content) 
                                            : truncateText(stripHtmlTags(presentation.content), 50)} {/* Contenu tronqué à 50 caractères */}
                                        <button 
                                            onClick={() => toggleExpandContent(presentation.id)} 
                                            className="btn btn-link p-0 ml-2">
                                            {expandedContent === presentation.id ? 'Réduire' : 'Lire plus'}
                                        </button>
                                    </td>
                                    <td className="align-middle text-center">{getTeamNameById(presentation.team_id)}</td>
                                    <td className="align-middle text-center">
                                        <Link 
                                            to={`/dashboard/PresentationEdit/${presentation.id}`} 
                                            className="btn btn-primary mb-2">
                                            Modifier
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(presentation.id)} 
                                            className="btn btn-danger mb-2">
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4">Aucune présentation disponible</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PresentationAdmin;

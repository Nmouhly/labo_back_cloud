import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';
import parse from 'html-react-parser';

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

const AdminAxes = () => {
    const [axes, setAxes] = useState([]);
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        fetchAxes();
        fetchTeams();
    }, [accessToken]);

    const fetchAxes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/axes', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (Array.isArray(response.data)) {
                setAxes(response.data);
            } else {
                setError('Erreur de données : Les données reçues ne sont pas un tableau');
            }
        } catch (error) {
            const errorMessage = error.response 
                ? (error.response.data.message || 'Erreur inconnue du serveur') + ' - Code: ' + error.response.status
                : error.message || 'Erreur inconnue';
            setError('Erreur lors de la récupération des axes : ' + errorMessage);
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
                setError('Erreur de données : Les données reçues ne sont pas un tableau');
            }
        } catch (error) {
            const errorMessage = error.response 
                ? (error.response.data.message || 'Erreur inconnue du serveur') + ' - Code: ' + error.response.status
                : error.message || 'Erreur inconnue';
            setError('Erreur lors de la récupération des équipes : ' + errorMessage);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet axe ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/axes/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setAxes(axes.filter(axe => axe.id !== id));
                toast.success('Axe supprimé avec succès');
            } catch (error) {
                toast.error('Erreur lors de la suppression de l\'axe');
            }
        }
    };

    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    const getTeamNameById = (id) => {
        const team = teams.find(team => team.id === id);
        return team ? team.name : 'Inconnu';
    };

    return (
        <div className="container mt-5">
          



            <h1 className="my-4">Gestion des Axes de Recherche</h1>
                <Link to="/dashboard/AxeCreate" className="btn btn-primary mb-4">Ajouter un Axe</Link>
            {error && <div className="alert alert-danger">{error}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Titre</th>
                            <th scope="col">Description</th>
                            <th scope="col">Équipe</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {axes.length ? (
                            axes.map(axe => (
                                <tr key={axe.id}>
                                    <td>{parse(axe.title)}</td>
                                    <td>
                                        {expanded === axe.id ? 
                                            stripHtmlTags(axe.content) 
                                            : truncateText(stripHtmlTags(axe.content), 80)}
                                        <button 
                                            onClick={() => toggleExpand(axe.id)} 
                                            className="btn btn-link btn-sm p-0 ml-2">
                                            {expanded === axe.id ? 'Réduire' : 'Lire plus'}
                                        </button>
                                    </td>
                                    <td>{getTeamNameById(axe.team_id)}</td>
                                    <td>
                                        <Link to={`/dashboard/AxeEdit/${axe.id}`}   className="btn btn-primary mb-2">
                                            Modifier
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(axe.id)} 
                                            className="btn btn-danger mb-2">
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">Aucun axe disponible</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAxes;

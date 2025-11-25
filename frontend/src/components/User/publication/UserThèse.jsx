import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserThese = () => {
    const [theses, setTheses] = useState([]);
    const navigate = useNavigate();
    const { currentUser, accessToken } = useContext(AuthContext);

    // Fonction pour récupérer les thèses de l'utilisateur
    const fetchTheses = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/theses/user-or-contributor/${currentUser.id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setTheses(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des thèses:', error);
            toast.error('Erreur lors de la récupération des thèses');
        }
    };

    // Utiliser useEffect pour récupérer les thèses lorsque le composant est monté
    useEffect(() => {
        fetchTheses();
    }, [currentUser.id, accessToken]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette thèse ?");
        if (!confirmDelete) return; // Si l'utilisateur annule, on arrête la fonction
    
        try {
            await axios.delete(`http://localhost:8000/api/thesesUser/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            toast.success('Thèse supprimée avec succès');
            fetchTheses(); // Recharger la liste des thèses
        } catch (error) {
            console.error('Erreur lors de la suppression de la thèse:', error);
            toast.error('Erreur lors de la suppression de la thèse');
        }
    };
    
    const handleEdit = (id) => {
        navigate(`/user/UserEditThese/${id}`);
    };

    return (
        <div className="container mt-4">
            <h1 className=" mb-4">Liste des Thèses</h1>
            <div className="mb-4">
                <button
                    onClick={() => navigate('/user/UserCreateThèse')}
                    className="btn btn-primary"
                >
                    Ajouter une Thèse
                </button>
            </div>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead className="table-light">
                        <tr>
                            <th>Titre</th>
                            <th>Auteur</th>
                            <th>DOI</th>
                            <th>Lieu</th>
                            <th>Date</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {theses.length ? (
                            theses.map(these => (
                                <tr key={these.id}>
                                    <td>{these.title || 'Titre non disponible'}</td>
                                    <td>{these.author || 'Auteur non disponible'}</td>
                                    <td>
                                        {these.doi ? (
                                            <a
                                                href={`https://doi.org/${these.doi}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => {
                                                    const isValidDOI = these.doi.startsWith('10.');
                                                    if (!isValidDOI) {
                                                        e.preventDefault();
                                                        alert('Le DOI fourni semble invalide ou non trouvé. Vous pouvez essayer le lien PDF si disponible.');
                                                    }
                                                }}
                                            >
                                                {these.doi}
                                            </a>
                                        ) : (
                                            'Pas de DOI disponible'
                                        )}
                                    </td>
                                    <td>{these.lieu || 'Lieu non disponible'}</td>
                                    <td>{new Date(these.date).toLocaleDateString() || 'Date non disponible'}</td>
                                    <td>{these.status || 'Statut non disponible'}</td>

                                    <td className="text-center">
                                    <div className="d-flex justify-content-between">   
                                        <button
                                            onClick={() => handleEdit(these.id)}
                                            className="btn btn-primary mb-2"                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(these.id)}
                                            className="btn btn-danger mb-2"
                                        >
                                            Supprimer
                                        </button></div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">Aucune thèse disponible</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserThese;

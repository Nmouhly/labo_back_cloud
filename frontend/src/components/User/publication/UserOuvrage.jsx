import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserOuvrage = () => {
    const [ouvrages, setOuvrages] = useState([]);
    const navigate = useNavigate();
    const { currentUser, accessToken } = useContext(AuthContext);

    const fetchOuvrages = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/ouvrages/user-or-contributor/${currentUser.id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setOuvrages(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des ouvrages:', error);
            toast.error('Erreur lors de la récupération des ouvrages');
        }
    };

    useEffect(() => {
        fetchOuvrages();
    }, [currentUser.id, accessToken]);

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet ouvrage ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/ouvragesUser/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                toast.success('Ouvrage supprimé avec succès');
                fetchOuvrages();
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'ouvrage:', error);
                toast.error('Erreur lors de la suppression de l\'ouvrage');
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/user/UserEditOuvrage/${id}`);
    };

    return (
        <div className="container mt-4">
            <h1 className=" mb-4">Liste des Ouvrages</h1>
            <div className=" mb-4">
                <button
                    onClick={() => navigate('/user/UserCreateOuvrage')}
                    className="btn btn-primary"
                >
                    Ajouter un Ouvrage
                </button>
            </div>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Titre</th>
                            <th scope="col">Auteur</th>
                            <th scope="col">DOI</th>
                            <th scope="col">Statut</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ouvrages.length ? (
                            ouvrages.map(ouvrage => (
                                <tr key={ouvrage.id}>
                                    <td>{ouvrage.title}</td>
                                    <td>{ouvrage.author}</td>
                                    <td>
                                        {ouvrage.DOI ? (
                                            <a
                                                href={`https://doi.org/${ouvrage.DOI}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => {
                                                    const isValidDOI = ouvrage.DOI.startsWith('10.');
                                                    if (!isValidDOI) {
                                                        e.preventDefault();
                                                        alert(
                                                            'Le DOI fourni semble invalide ou non trouvé. Vous pouvez essayer le lien PDF si disponible.'
                                                        );
                                                    }
                                                }}
                                            >
                                                {ouvrage.DOI}
                                            </a>
                                        ) : (
                                            'Pas de DOI disponible'
                                        )}
                                    </td>
                                    <td>{ouvrage.status}</td>
                                    <td>
                                    <div className="d-flex justify-content-between">                                        <button
                                            onClick={() => handleEdit(ouvrage.id)}
                                           className="btn btn-primary mb-2"
                                        >
                                            Modifier                                                    
                                        </button>
                                        <button
                                            onClick={() => handleDelete(ouvrage.id)}
                                            className="btn btn-danger mb-2"
                                        >
                                            Supprimer
                                        </button></div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">Aucun ouvrage disponible</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserOuvrage;

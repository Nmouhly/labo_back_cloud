import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserRapport = () => {
    const [rapports, setRapports] = useState([]);
    const navigate = useNavigate();
    const { currentUser, accessToken } = useContext(AuthContext);

    // Fonction pour récupérer les rapports de l'utilisateur
    const fetchRapports = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/rapports/user-or-contributor/${currentUser.id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setRapports(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des rapports:', error);
            toast.error('Erreur lors de la récupération des rapports');
        }
    };

    // Utiliser useEffect pour récupérer les rapports lorsque le composant est monté
    useEffect(() => {
        fetchRapports();
    }, [currentUser.id, accessToken]);

    // Fonction de suppression avec confirmation
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ? Cette action est irréversible.');
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8000/api/rapportUser/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}` // Authentification requise
                    }
                });
                toast.success('Rapport supprimé avec succès');
                fetchRapports(); // Recharger la liste des rapports après suppression
            } catch (error) {
                console.error('Erreur lors de la suppression du rapport:', error);
                toast.error('Erreur lors de la suppression du rapport');
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/user/UserEditRapport/${id}`);
    };

    return (
        <div className="container mt-4">
            <h1 className="h2 mb-4">Liste des Rapports</h1>
            <button
                onClick={() => navigate('/user/UserCreateRapport')}
                className="btn btn-primary mb-4"
            >
                Ajouter un Rapport
            </button>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th>Titre</th>
                            <th>Auteur</th>
                            <th>DOI</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rapports.length ? (
                            rapports.map(rapport => (
                                <tr key={rapport.id}>
                                    <td>{rapport.title || 'Titre non disponible'}</td>
                                    <td>{rapport.author || 'Auteur non disponible'}</td>
                                    <td>
                                        {rapport.DOI ? (
                                            <a
                                                href={`https://doi.org/${rapport.DOI}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => {
                                                    const isValidDOI = rapport.DOI.startsWith('10.');
                                                    if (!isValidDOI) {
                                                        e.preventDefault();
                                                        alert('Le DOI fourni semble invalide ou non trouvé. Vous pouvez essayer le lien PDF si disponible.');
                                                    }
                                                }}
                                            >
                                                {rapport.DOI}
                                            </a>
                                        ) : (
                                            'Pas de DOI disponible'
                                        )}
                                    </td>
                                    <td>{rapport.status}</td>
                                    <td className="text-center">
                                    <div className="d-flex justify-content-between">   
                                        <button
                                            onClick={() => handleEdit(rapport.id)}
                                            className="btn btn-primary mb-2"                                        >
                                            Modifier            
                                        </button>
                                        <button
                                            onClick={() => handleDelete(rapport.id)}
                                            className="btn btn-danger mb-2"
                                        >
                                            Supprimer
                                        </button></div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">Aucun rapport disponible</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserRapport;

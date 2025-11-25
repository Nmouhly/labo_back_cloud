import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserRevue = () => {
    const [revues, setRevues] = useState([]);
    const navigate = useNavigate();
    const { currentUser, accessToken } = useContext(AuthContext);

    // Function to fetch user's revues
    const fetchRevues = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/revues/user-or-contributor/${currentUser.id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setRevues(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des revues:', error);
            toast.error('Erreur lors de la récupération des revues');
        }
    };

    // useEffect to fetch revues on component mount
    useEffect(() => {
        fetchRevues();
    }, [currentUser.id, accessToken]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette revue ?');
        
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8000/api/revuesUser/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                toast.success('Revue supprimée avec succès');
                fetchRevues(); // Reload the list of revues
            } catch (error) {
                console.error('Erreur lors de la suppression de la revue:', error);
                toast.error('Erreur lors de la suppression de la revue');
            }
        } else {
            toast.info('Suppression annulée');
        }
    };
    
    const handleEdit = (id) => {
        navigate(`/user/UserEditRevue/${id}`);
    };

    return (
        <div className="container mt-4">
            <h1 className=" mb-4">Liste des Revues</h1>
            <button
                onClick={() => navigate('/user/UserCreateRevue')}
                className="btn btn-primary mb-4"
            >
                Ajouter une Revue
            </button>
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th>Titre</th>
                            <th>Auteur</th>
                            <th>DOI</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {revues.length ? (
                            revues.map(revue => (
                                <tr key={revue.id}>
                                    <td>{revue.title}</td>
                                    <td>{revue.author}</td>
                                    <td>
                                        {revue.DOI ? (
                                            <a
                                                href={`https://doi.org/${revue.DOI}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => {
                                                    const isValidDOI = revue.DOI.startsWith('10.');
                                                    if (!isValidDOI) {
                                                        e.preventDefault();
                                                        alert(
                                                            'Le DOI fourni semble invalide ou non trouvé. Vous pouvez essayer le lien PDF si disponible.'
                                                        );
                                                    }
                                                }}
                                            >
                                                {revue.DOI}
                                            </a>
                                        ) : (
                                            'Pas de DOI disponible'
                                        )}
                                    </td>
                                    <td>{revue.status}</td>
                                    <td className="text-nowrap">
                                        <button
                                            onClick={() => handleEdit(revue.id)}
                                            className="btn btn-primary mb-2"                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(revue.id)}
                                            className="btn btn-danger mb-2"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">Aucune revue disponible</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserRevue;

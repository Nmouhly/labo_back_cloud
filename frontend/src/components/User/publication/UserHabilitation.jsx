import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserHabilitation = () => {
    const [habilitations, setHabilitations] = useState([]);
    const navigate = useNavigate();
    const { currentUser, accessToken } = useContext(AuthContext);

    // Fonction pour récupérer les habilitations de l'utilisateur
    const fetchHabilitations = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/habilitations/user-or-contributor/${currentUser.id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setHabilitations(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des habilitations:', error);
            toast.error('Erreur lors de la récupération des habilitations');
        }
    };

    // Utiliser useEffect pour récupérer les habilitations lorsque le composant est monté
    useEffect(() => {
        fetchHabilitations();
    }, [currentUser.id, accessToken]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette habilitation ?");
        if (!confirmDelete) return; // Si l'utilisateur annule, on arrête la fonction

        try {
            await axios.delete(`http://localhost:8000/api/habilitationsUser/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            toast.success('Habilitation supprimée avec succès');
            fetchHabilitations(); // Recharger la liste des habilitations
        } catch (error) {
            console.error('Erreur lors de la suppression d\'habilitation:', error);
            toast.error('Erreur lors de la suppression d\'habilitation');
        }
    };

    const handleEdit = (id) => {
        navigate(`/user/UserEditHabilitation/${id}`);
    };

    return (
        <div className="container mt-4">
            <h1 className=" mb-4">Liste des Habilitations</h1>
            <div className=" mb-4">
                <button
                    onClick={() => navigate('/user/UserCreateHabilitation')}
                    className="btn btn-primary"
                >
                    Ajouter une Habilitation
                </button>
            </div>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Titre</th>
                            <th scope="col">Auteur</th>
                            <th scope="col">DOI</th>
                            <th scope="col">Lieu</th>
                            <th scope="col">Date</th>
                            <th scope="col">Statut</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {habilitations.length ? (
                            habilitations.map(habilitation => (
                                <tr key={habilitation.id}>
                                    <td>{habilitation.title}</td>
                                    <td>{habilitation.author}</td>
                                    <td>
                                        {habilitation.doi ? (
                                            <a
                                                href={`https://doi.org/${habilitation.doi}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => {
                                                    const isValidDOI = habilitation.doi.startsWith('10.');
                                                    if (!isValidDOI) {
                                                        e.preventDefault();
                                                        alert('Le DOI fourni semble invalide ou non trouvé. Vous pouvez essayer le lien PDF si disponible.');
                                                    }
                                                }}
                                            >
                                                {habilitation.doi}
                                            </a>
                                        ) : (
                                            'Pas de DOI disponible'
                                        )}
                                    </td>
                                    <td>{habilitation.lieu}</td>
                                    <td>{new Date(habilitation.date).toLocaleDateString()}</td>
                                    <td>{habilitation.status}</td>
                                    <td className="text-center">
                                    <div className="d-flex justify-content-between">   
                                        <button
                                            onClick={() => handleEdit(habilitation.id)}
                                            className="btn btn-primary mb-2"                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(habilitation.id)}
                                            className="btn btn-danger mb-2"
                                        >
                                            Supprimer
                                        </button></div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">Aucune habilitation disponible</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserHabilitation;

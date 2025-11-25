import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';
import { useNavigate } from 'react-router-dom';

const UserBrevet = () => {
    const [brevets, setBrevets] = useState([]);
    const { accessToken, currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchBrevets = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/brevets/user-or-contributor/${currentUser.id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setBrevets(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des brevets:', error);
            toast.error('Erreur lors de la récupération des brevets');
        }
    };

    useEffect(() => {
        fetchBrevets();
    }, [accessToken]);

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce brevet ?');
        if (!isConfirmed) return;

        try {
            await axios.delete(`http://localhost:8000/api/brevetUser/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            toast.success('Brevet supprimé avec succès');
            fetchBrevets(); // Rafraîchir la liste des brevets
        } catch (error) {
            console.error('Erreur lors de la suppression du brevet:', error);
            toast.error('Erreur lors de la suppression du brevet');
        }
    };

    const handleEdit = (id) => {
        navigate(`/user/UserEditBrevet/${id}`);
    };

    return (
        <div className="container mt-4">
            <h1 className="h2 mb-4">Liste des Brevets</h1>
            <button
                onClick={() => navigate('/user/UserCreateBrevet')}
                className="btn btn-primary mb-4"
            >
                Ajouter un Brevet
            </button>
            <table className="table table-bordered">
                <thead className="thead-light">
                    <tr>
                        <th>Titre</th>
                        <th>Auteur(s)</th>
                        <th>DOI</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {brevets.length ? (
                        brevets.map(brevet => (
                            <tr key={brevet.id}>
                                <td>{brevet.title}</td>
                                <td>{brevet.author}</td>
                                <td>
                                    {brevet.doi ? (
                                        <a
                                            href={`https://doi.org/${brevet.doi}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => {
                                                const isValidDOI = brevet.doi.startsWith('10.');
                                                if (!isValidDOI) {
                                                    e.preventDefault();
                                                    alert('Le DOI fourni semble invalide ou non trouvé. Vous pouvez essayer le lien PDF si disponible.');
                                                }
                                            }}
                                        >
                                            {brevet.doi}
                                        </a>
                                    ) : (
                                        'Pas de DOI disponible'
                                    )}
                                </td>
                                <td>{brevet.status}</td>
                                <td>
                                <div className="d-flex justify-content-between">                                  
                                    
                                    
                                    
                                    
                                    
                                      <button onClick={() => handleEdit(brevet.id)}                                            className="btn btn-primary mb-2"
                                      >Modifier</button>
                                    <button onClick={() => handleDelete(brevet.id)} className="btn btn-danger mb-2">Supprimer</button></div>
                                </td>
                            </tr>                                                             
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">Aucun brevet trouvé</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserBrevet;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const AdminHabilitation = () => {
    const [habilitations, setHabilitations] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchHabilitations();
    }, [accessToken]);

    const fetchHabilitations = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/habilitationAdmin', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setHabilitations(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des habilitations', error);
            setError('Erreur lors de la récupération des habilitations');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette habilitation ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/habilitations/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setHabilitations(habilitations.filter(habilitation => habilitation.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'habilitation', error);
                setError('Erreur lors de la suppression de l\'habilitation');
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gestion des Habilitations</h1>
            <Link to="/dashboard/HabilitationCreate" className="btn btn-primary mb-4">Ajouter une Habilitation</Link>
            {error && <p className="text-danger mb-4">{error}</p>}
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
                                    <td>{habilitation.date}</td>
                                    <td>{habilitation.status}</td>
                                    <td>
                                    <div className="d-flex justify-content-between">
    <Link to={`/dashboard/HabilitationEdit/${habilitation.id}`} className="btn btn-primary mb-2">Modifier</Link>
    <button onClick={() => handleDelete(habilitation.id)} className="btn btn-danger mb-2">Supprimer</button>
</div>
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

export default AdminHabilitation;

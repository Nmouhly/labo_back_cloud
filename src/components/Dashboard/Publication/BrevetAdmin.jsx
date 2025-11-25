import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const BrevetAdmin = () => {
    const [brevets, setBrevets] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        const fetchBrevets = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/brevetsAdmin', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (Array.isArray(response.data)) {
                    setBrevets(response.data);
                } else {
                    console.error('Les données reçues ne sont pas un tableau');
                    setError('Erreur de données');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des brevets:', error);
                setError('Erreur lors de la récupération des brevets');
            }
        };

        fetchBrevets();
    }, [accessToken]);

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce brevet ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/brevets/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setBrevets(brevets.filter(brevet => brevet.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression du brevet:', error);
                setError('Erreur lors de la suppression du brevet');
            }
        }
    };

    return (
        <div className="container ">
            <h1 className="my-4">Gestion des Brevets</h1>
                <Link to="/dashboard/BrevetCreate" className="btn btn-primary mb-4">Ajouter un Brevet</Link>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="table-responsive">
                <table className="table table-striped">
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
                                    <div className="d-flex justify-content-between">    <Link to={`/dashboard/BrevetEdit/${brevet.id}`} className="btn btn-primary mb-2">Modifier</Link>
    <button onClick={() => handleDelete(brevet.id)} className="btn btn-danger mb-2">Supprimer</button>
    </div>
</td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">Aucun brevet disponible</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BrevetAdmin;

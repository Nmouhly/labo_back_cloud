import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const OuvrageAdmin = () => {
    const [ouvrages, setOuvrages] = useState([]);
    const [error, setError] = useState('');
    const { accessToken, currentUser } = useContext(AuthContext);

    useEffect(() => {
        if (accessToken && currentUser) {
            fetchOuvrages();
        }
    }, [accessToken, currentUser]);

    const fetchOuvrages = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/ouvragesAdmin', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setOuvrages(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des ouvrages', error);
            setError('Erreur lors de la récupération des ouvrages');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet ouvrage ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/ouvrages/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setOuvrages(ouvrages.filter(ouvrage => ouvrage.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'ouvrage', error);
                setError('Erreur lors de la suppression de l\'ouvrage');
            }
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Gestion des Ouvrages</h1>
            <Link to="/dashboard/OuvrageCreate" className="btn btn-primary mb-4">Ajouter un Ouvrage</Link>
            {error && <p className="text-danger">{error}</p>}

            <table className="table table-striped table-hover">
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
                                                    alert('Le DOI fourni semble invalide ou non trouvé. Vous pouvez essayer le lien PDF si disponible.');
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
                                    <div className="d-flex justify-content-between">
                                        <Link to={`/dashboard/OuvrageEdit/${ouvrage.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                        <button onClick={() => handleDelete(ouvrage.id)} className="btn btn-danger mb-2">Supprimer</button>
                                    </div>
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
    );
};

export default OuvrageAdmin;

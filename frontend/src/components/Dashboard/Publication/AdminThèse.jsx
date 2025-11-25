import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const AdminThese = () => {
    const [theses, setTheses] = useState([]);
    const [error, setError] = useState('');
    const { accessToken, currentUser } = useContext(AuthContext); // Access the currentUser

    useEffect(() => {
        if (accessToken && currentUser) {
            fetchTheses();
        }
    }, [accessToken, currentUser]);

    const fetchTheses = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/theseAdmin', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setTheses(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des thèses', error);
            setError('Erreur lors de la récupération des thèses');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette thèse ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/theses/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setTheses(theses.filter(these => these.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression de la thèse', error);
                setError('Erreur lors de la suppression de la thèse');
            }
        }
    };

    return (
        <div className="container">
            <h1 className="my-4">Gestion des Thèses</h1>
            <Link to="/dashboard/TheseCreate" className="btn btn-primary mb-4">Ajouter une Thèse</Link>
            {error && <div className="alert alert-danger">{error}</div>}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Auteur</th>
                        <th>DOI</th>
                        <th>Date</th>
                        <th>Lieu</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {theses.length ? (
                        theses.map(these => (
                            <tr key={these.id}>
                                <td>{these.title}</td>
                                <td>{these.author}</td>
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
                                    ) : 'Pas de DOI disponible'}
                                </td>
                                <td>{these.date || 'Pas de date disponible'}</td>
                                <td>{these.lieu || 'Pas de lieu disponible'}</td>
                                <td>{these.status}</td>
                                <td>
                                <div className="d-flex justify-content-between">    <Link to={`/dashboard/TheseEdit/${these.id}`} className="btn btn-primary mb-2">Modifier</Link>
    <button onClick={() => handleDelete(these.id)} className="btn btn-danger mb-2">Supprimer</button>
    </div>
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
    );
};

export default AdminThese;

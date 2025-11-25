import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const ConferenceAdmin = () => {
    const [conferences, setConferences] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        if (accessToken) {
            fetchConferences();
        }
    }, [accessToken]);

    const fetchConferences = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/conferences', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (Array.isArray(response.data)) {
                setConferences(response.data);
            } else {
                setError('Erreur de données');
            }
        } catch (error) {
            setError('Erreur lors de la récupération des conférences');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette conférence ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/conferences/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                setConferences(conferences.filter(conference => conference.id !== id));
            } catch (error) {
                setError('Erreur lors de la suppression de la conférence');
            }
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Gestion des Conférences</h1>
            <Link to="/dashboard/ConferenceCreate" className="btn btn-primary mb-4">Ajouter une Conférence</Link>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Image</th>
                            <th scope="col">Titre</th>
                            <th scope="col">Date</th>
                            <th scope="col">Lieu</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {conferences.length > 0 ? (
                            conferences.map(conference => (
                                <tr key={conference.id}>
                                    <td>
                                        {conference.image && (
                                            <img
                                                src={conference.image} // URL complète de l'image sur Cloudinary
                                                alt={conference.title || 'Image de la conférence'}
                                                className="img-thumbnail"
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            />
                                        )}
                                    </td>
                                    <td>{conference.title}</td>
                                    <td>{conference.date}</td>
                                    <td>{conference.location}</td>
                                    <td>
                                        <Link to={`/dashboard/ConferenceEdit/${conference.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                        <button onClick={() => handleDelete(conference.id)} className="btn btn-danger mb-2">Supprimer</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">Aucune conférence disponible</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ConferenceAdmin;

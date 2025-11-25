import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const SeminarList = () => {
    const [seminars, setSeminars] = useState([]);
    const [error, setError] = useState('');
    const [expandedSeminars, setExpandedSeminars] = useState(new Set());
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchSeminars();
    }, [accessToken]);

    const fetchSeminars = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/seminars', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setSeminars(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des séminaires', error);
            setError('Erreur lors de la récupération des séminaires');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce séminaire ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/seminars/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setSeminars(seminars.filter(seminar => seminar.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression du séminaire', error);
                setError('Erreur lors de la suppression du séminaire');
            }
        }
    };

    const toggleDescription = (id) => {
        setExpandedSeminars((prev) => {
            const newExpandedSeminars = new Set(prev);
            if (newExpandedSeminars.has(id)) {
                newExpandedSeminars.delete(id);
            } else {
                newExpandedSeminars.add(id);
            }
            return newExpandedSeminars;
        });
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Gestion des Séminaires</h1>
            <Link to="/dashboard/SeminarForm" className="btn btn-primary mb-4">Ajouter un Séminaire</Link>
            {error && <p className="text-danger">{error}</p>}
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>Titre</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Heure de Début</th>
                            <th>Heure de Fin</th>
                            <th>Lieu</th>
                            <th>Intervenant</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {seminars.length ? (
                            seminars.map(seminar => (
                                <tr key={seminar.id}>
                                    <td>{seminar.title}</td>
                                    <td>
                                        {expandedSeminars.has(seminar.id) ? (
                                            <span>{seminar.description}</span>
                                        ) : (
                                            <span>
                                                {seminar.description.length > 100 
                                                    ? `${seminar.description.substring(0, 100)}... ` 
                                                    : seminar.description}
                                                {seminar.description.length > 100 && 
                                                    <button 
                                                        onClick={() => toggleDescription(seminar.id)} 
                                                        className="btn btn-link p-0">Lire la suite</button>}
                                            </span>
                                        )}
                                    </td>
                                    <td>{seminar.date}</td>
                                    <td>{seminar.start_time}</td>
                                    <td>{seminar.end_time}</td>
                                    <td>{seminar.location}</td>
                                    <td>{seminar.speaker}</td>
                                    <td>{seminar.status}</td>
                                    <td>
                                    <div className="d-flex justify-content-between">  
                                       <Link to={`/dashboard/SeminarDetails/${seminar.id}`}className="btn btn-primary mb-2">Modifier</Link>
                                        <button onClick={() => handleDelete(seminar.id)} className="btn btn-danger mb-2">Supprimer</button></div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center">Aucun séminaire disponible</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SeminarList;

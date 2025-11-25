import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Conference.css'; // Importer le fichier CSS spécifique aux conférences

const Conference = () => {
    const [conferences, setConferences] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/conferences')
            .then(response => {
                setConferences(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des conférences', error);
                setError('Erreur lors de la récupération des conférences');
            });
    }, []);

    return (
        <div className="conference-container">
            <h1>Conférences</h1>
            {error && <p className="error">{error}</p>}
            <div className="conference-list">
                {conferences.length > 0 ? (
                    conferences.map(conference => (
                        <div key={conference.id} className="conference-card">
                            {conference.image && (
                                <img
                                    src={conference.image} // URL complète de l'image sur Cloudinary
                                    alt={conference.title || 'Image de la conférence'}
                                    className="conference-image"
                                />
                            )}
                            <h3>{conference.title || 'Titre non disponible'}</h3>
                            <p className="conference-date">Le {conference.date || 'Date non disponible'}</p>
                            <p className="conference-location">Conférences à {conference.location || 'Lieu non disponible'}</p>
                        </div>
                    ))
                ) : (
                    <p>Aucune conférence disponible.</p>
                )}
            </div>
        </div>
    );
};

export default Conference;

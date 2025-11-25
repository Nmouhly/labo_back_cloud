import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Patents.css'; // Importer le fichier CSS

const Patents = () => {
    const [patents, setPatents] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Remplacez l'URL par celle de votre API si nécessaire
        axios.get('http://localhost:8000/api/brevets/acceptes')
            .then(response => {
                console.log('Données récupérées:', response.data); // Vérifier les données reçues
                setPatents(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des brevets', error);
                setError('Erreur lors de la récupération des brevets');
            });
    }, []);

    return (
        <div className="patents-page">
            <h1>Brevets</h1>
            {error && <p className="error">{error}</p>}

            <div className="patents-container">
                {patents.length > 0 ? (
                    patents.map(patent => (
                        <div className="patent-card" key={patent.id}>
                            <h3>{patent.title || 'Titre non disponible'}</h3>
                            <p><strong>Auteur(s):</strong> {patent.author || 'Auteur non disponible'}</p>
                            <p><strong>DOI:</strong>{patent.doi ? (
                                <a href={`https://doi.org/${patent.doi}`} target="_blank" rel="noopener noreferrer" className="doi-link">
                                    {patent.doi}
                                </a>
                            ) : (
                                <span>DOI non disponible</span>
                            )}</p>
                        </div>
                    ))
                ) : (
                    <p>Aucun brevet disponible.</p>
                )}
            </div>
        </div>
    );
};

export default Patents;

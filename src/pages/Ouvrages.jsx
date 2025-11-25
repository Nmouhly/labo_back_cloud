import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Ouvrage.css'; // Importer le fichier CSS

const Ouvrages = () => {
    const [ouvrages, setOuvrages] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/ouvrages/acceptes') // Fetch only accepted ouvrages
            .then(response => {
                setOuvrages(response.data);
            })
            .catch(error => {
                setError('Erreur lors de la récupération des ouvrages');
            });
    }, []);
    

    return (
        <div className="ouvrages-list">
            <h1>Ouvrages</h1>
            {error && <p className="error">{error}</p>}
            {ouvrages.length > 0 ? (
                <ul>
                    {ouvrages.map(ouvrage => (
                        <li key={ouvrage.id}>
                            <strong>{ouvrage.title || 'Titre non disponible'}.</strong> {ouvrage.author || 'Auteur non disponible'}.
                            {ouvrage.DOI ? (
                                <a href={`https://doi.org/${ouvrage.DOI}`} target="_blank" rel="noopener noreferrer" className="doi-link">DOI</a>
                            ) : (
                                <span>DOI non disponible</span>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucun ouvrage disponible.</p>
            )}
        </div>
    );
};

export default Ouvrages;

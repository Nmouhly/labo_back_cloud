import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Revues.css'; // Importer le fichier CSS

const Revues = () => {
    const [revues, setRevues] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/revues/acceptes')
            .then(response => {
                setRevues(response.data);
            })
            .catch(error => {
                setError('Erreur lors de la récupération des revues');
            });
    }, []);

    return (
        <div className="revues-list">
            <h1>Revues</h1>
            {error && <p className="error">{error}</p>}
            {revues.length > 0 ? (
                <ul>
                    {revues.map(revue => (
                        <li key={revue.id}>
                            <strong>{revue.title || 'Titre non disponible'}.</strong> {revue.author || 'Auteur non disponible'}.
                            {revue.DOI ? (
                                <a href={`https://doi.org/${revue.DOI}`} target="_blank" rel="noopener noreferrer" className="doi-link">
                                    DOI
                                </a>
                            ) : (
                                <span>DOI non disponible</span>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucune revue disponible.</p>
            )}
        </div>
    );
};

export default Revues;

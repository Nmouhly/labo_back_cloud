



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Reports.css'; // Importer le fichier CSS
import Patents from './Patents';


const Reports = () => {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Remplacez l'URL par celle de votre API si nécessaire
        axios.get('http://localhost:8000/api/reportes/acceptes')
            .then(response => {
                console.log('Données récupérées:', response.data); // Vérifier les données reçues
                setReports(response.data);
            })
            .catch(error => {
                if (error.response) {
                    console.error('Erreur de réponse:', error.response);
                    setError(`Erreur: ${error.response.status} - ${error.response.statusText}`);
                } else if (error.request) {
                    console.error('Aucune réponse reçue:', error.request);
                    setError('Aucune réponse reçue du serveur');
                } else {
                    console.error('Erreur lors de la configuration de la requête:', error.message);
                    setError(`Erreur: ${error.message}`);
                }
            });
    }, []);

    return (
        <div className="reports-page">
            <h1>Rapports</h1>
            {error && <p className="error">{error}</p>}

            <div className="reports-container">
                {reports.length > 0 ? (
                    reports.map(report => (
                        <div className="report-card" key={report.id}>
                            <h3>{report.title || 'Titre non disponible'}</h3>
                            <p><strong>Auteur(s):</strong> {report.author || 'Auteur non disponible'}</p>
                           
                            <p><strong>DOI:</strong> {report.DOI ? (
                                <a href={`https://doi.org/${report.DOI}`} target="_blank" rel="noopener noreferrer" className="doi-link">
                                    {report.DOI}
                                </a>
                            ) : (
                                <span>DOI non disponible</span>
                            )}</p>
                        </div>
                    ))
                ) : (
                    <p>Aucun rapport disponible.</p>
                )}
            </div>
            <Patents />

        </div>
    );
};

export default Reports;






































import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './seminars-page.css';
 // Import the CSS file

const Seminar = () => {
    const [ongoingSeminars, setOngoingSeminars] = useState([]);
    const [completedSeminars, setCompletedSeminars] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSeminars();
    }, []);

    const fetchSeminars = async () => {
        try {
            const ongoingResponse = await axios.get('http://localhost:8000/api/seminar/ongoing');
            console.log('Ongoing seminars response:', ongoingResponse.data);
            setOngoingSeminars(ongoingResponse.data);
        } catch (err) {
            console.error("Error fetching ongoing seminars:", err);
            setError('Erreur lors de la récupération des séminaires prévus');
        }

        try {
            const completedResponse = await axios.get('http://localhost:8000/api/seminar/completed');
            console.log('Completed seminars response:', completedResponse.data);
            setCompletedSeminars(completedResponse.data);
        } catch (err) {
            console.error("Error fetching completed seminars:", err);
            setError('Erreur lors de la récupération des séminaires passés');
        }
    };

    return (
        <div className="seminars-page">
            <h1 className="titlee">Séminaires du laboratoire</h1>
            {error && <p className="error">{error}</p>}
            <h2>À venir</h2>
            <div className="seminars ongoing">
                {ongoingSeminars.length > 0 ? (
                    ongoingSeminars.map(seminar => (
                        <div className="seminar-card" key={seminar.id}>
                            <h3>{seminar.title || 'Titre non disponible'}</h3>
                            <p><strong>Description:</strong> {seminar.description || 'Description non disponible'}</p>
                            <p><strong>Date:</strong> {new Date(seminar.date).toLocaleDateString() || 'Date non disponible'}</p>
                            <p><strong>Intervenant:</strong> {seminar.speaker || 'Intervenant non disponible'}</p>
                            <p><strong>Heure de début:</strong> {seminar.start_time || 'Heure non disponible'}</p>
                            <p><strong>Heure de fin:</strong> {seminar.end_time || 'Heure non disponible'}</p>
                            <p><strong>Lieu:</strong> {seminar.location || 'Lieu non disponible'}</p>
                        </div>
                    ))
                ) : (
                    <p>Aucun séminaire prévu.</p>
                )}
            </div>

            <h2> Passés</h2>
            <div className="seminars completed">
                {completedSeminars.length > 0 ? (
                    completedSeminars.map(seminar => (
                        <div className="seminar-card" key={seminar.id}>
                            <h3>{seminar.title || 'Titre non disponible'}</h3>
                            <p><strong>Description:</strong> {seminar.description || 'Description non disponible'}</p>
                            <p><strong>Date:</strong> {new Date(seminar.date).toLocaleDateString() || 'Date non disponible'}</p>
                            <p><strong>Intervenant:</strong> {seminar.speaker || 'Intervenant non disponible'}</p>
                            <p><strong>Heure de début:</strong> {seminar.start_time || 'Heure non disponible'}</p>
                            <p><strong>Heure de fin:</strong> {seminar.end_time || 'Heure non disponible'}</p>
                            <p><strong>Lieu:</strong> {seminar.location || 'Lieu non disponible'}</p>
                        </div>
                    ))
                ) : (
                    <p>Aucun séminaire passé.</p>
                )}
            </div>
        </div>
    );
};

export default Seminar;

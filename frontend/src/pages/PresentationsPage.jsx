import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser'; // Import the parsing library


const PresentationsPage = () => {
    const { teamId } = useParams(); // Obtenez l'ID de l'équipe depuis les paramètres de l'URL
    const [presentations, setPresentations] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPresentations = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/presentations?team_id=${teamId}`);
                setPresentations(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des présentations', error);
                setError('Erreur lors de la récupération des présentations');
            }
        };

        fetchPresentations();
    }, [teamId]);

    return (
        <div style={styles.container}>
            {error && <p style={styles.error}>{error}</p>}
            <h1 style={styles.title}>Présentations pour l’Équipe {teamId}</h1>
            <div style={styles.presentationsList}>
                {presentations.map(presentation => (
                    <div key={presentation.id} style={styles.presentationCard}>
                        <h2 style={styles.presentationTitle}>{parse(presentation.title)}</h2>
                        <div style={styles.presentationContent}>
                            <div dangerouslySetInnerHTML={{ __html: presentation.content }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px',
        maxWidth: '100%',
        margin: '0 auto',
        backgroundColor: '#f5f7f9',
        fontFamily: "'Roboto', sans-serif",
    },
    title: {
        fontSize: '2.8rem',
        marginBottom: '30px',
        color: '#333',
        textAlign: 'center',
        fontWeight: '700',
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)',
    },
    error: {
        color: '#e74c3c',
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: '20px',
        fontSize: '1.2rem',
    },
    presentationsList: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
    },
    presentationCard: {
        width: '90%',
        maxWidth: '800px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        textAlign: 'center',
    },
    presentationTitle: {
        fontSize: '2rem',
        marginBottom: '20px',
        color: '#333',
        fontWeight: '600',
    },
    presentationContent: {
        fontSize: '1rem',
        color: '#666',
        textAlign: 'left',
    },
};

export default PresentationsPage;

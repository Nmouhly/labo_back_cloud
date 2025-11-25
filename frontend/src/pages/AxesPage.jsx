import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser'; // Import the parsing library


const AxesPage = () => {
    const { teamId } = useParams(); // Obtenez l'ID de l'équipe depuis les paramètres de l'URL
    const [axes, setAxes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAxes = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/axes?team_id=${teamId}`);
                setAxes(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des axes', error);
                setError('Erreur lors de la récupération des axes');
            }
        };

        fetchAxes();
    }, [teamId]);

    return (
        <div style={styles.container}>
            {error && <p style={styles.error}>{error}</p>}
            <h1 style={styles.title}>Axes pour l’Équipe {teamId}</h1>
            <div style={styles.axesList}>
                {axes.map(axe => (
                    <div key={axe.id} style={styles.axeCard}>
                        <h2 style={styles.axeTitle}>{parse(axe.title)}</h2>
                        <div style={styles.axeContent}>
                            <div dangerouslySetInnerHTML={{ __html: axe.content }} />
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
    axesList: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
    },
    axeCard: {
        width: '90%',
        maxWidth: '800px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        textAlign: 'center',
    },
    axeTitle: {
        fontSize: '2rem',
        marginBottom: '20px',
        color: '#333',
        fontWeight: '600',
    },
    axeContent: {
        fontSize: '1rem',
        color: '#666',
        textAlign: 'left',
    },
};

export default AxesPage;

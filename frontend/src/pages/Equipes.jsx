import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TeamsPage = () => {
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/equipe');
                setTeams(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des équipes', error);
                setError('Erreur lors de la récupération des équipes');
            }
        };

        fetchTeams();
    }, []);

    return (
        <div style={styles.container}>
            {error && <p style={styles.error}>{error}</p>}
            <h1 style={styles.title}>Liste des Équipes</h1>
            <div style={styles.teamsList}>
                {teams.map(team => (
                    <div key={team.id} style={styles.teamCard}>
                        <h2 style={styles.teamName}>{team.name}</h2>
                        <div style={styles.links}>
                        <Link to={`/presentations/${team.id}`} style={styles.link}>Présentation</Link>
                            <Link to={`/axe/${team.id}`} style={styles.link}>Axes de Recherche</Link>
                            <Link to={`/membre/${team.id}`} style={styles.link}>Membres</Link>
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
    teamsList: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
    },
    teamCard: {
        width: '90%',
        maxWidth: '800px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        textAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
        transform: 'scale(1)',
    },
    teamCardHover: {
        transform: 'scale(1.02)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
    },
    teamName: {
        fontSize: '2rem',
        marginBottom: '20px',
        color: '#333',
        fontWeight: '600',
    },
    links: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        flexWrap: 'wrap',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
        fontSize: '1rem',
        fontWeight: '500',
        padding: '12px 20px',
        borderRadius: '8px',
        backgroundColor: '#eaf6ff',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        display: 'block',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    linkHover: {
        backgroundColor: '#cce5ff',
        color: '#0056b3',
    },
};

// Injecting hover styles using JavaScript for dynamic effect
const addHoverEffects = () => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        .teamCard:hover { transform: scale(1.02); box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2); }
        .link:hover { background-color: #cce5ff; color: #0056b3; }
    `;
    document.head.appendChild(styleSheet);
};

addHoverEffects();

export default TeamsPage;

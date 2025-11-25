import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MembersPage = () => {
    const { teamId } = useParams(); // Get the team ID from the URL parameters
    const [members, setMembers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/members?team_id=${teamId}`);
                setMembers(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des membres', error);
                setError('Erreur lors de la récupération des membres');
            }
        };

        fetchMembers();
    }, [teamId]);

    return (
        <div style={styles.container}>
            {error && <p style={styles.error}>{error}</p>}
            <h1 style={styles.title}>Membres de l’Équipe {teamId}</h1>
            <div style={styles.membersList}>
                {members.map(member => (
                    <div key={member.id} style={styles.memberCard}>
                        <h2 style={styles.memberName}>{member.name}</h2>
                        <p style={styles.memberPosition}>{member.position}</p>
                        <div style={styles.memberBio}>
                            <strong>Bio:</strong> {member.bio}
                        </div>
                        <div style={styles.memberContact}>
                            <strong>Contact:</strong> {member.contact_info}
                        </div>
                        <p style={styles.memberStatus}><strong>Statut:</strong> {member.statut}</p>
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
    membersList: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
    },
    memberCard: {
        width: '90%',
        maxWidth: '800px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        textAlign: 'center',
    },
    memberName: {
        fontSize: '2rem',
        marginBottom: '10px',
        color: '#333',
        fontWeight: '600',
    },
    memberPosition: {
        fontSize: '1.2rem',
        color: '#777',
        marginBottom: '10px',
    },
    memberBio: {
        fontSize: '1rem',
        color: '#666',
        marginBottom: '10px',
        textAlign: 'left',
    },
    memberContact: {
        fontSize: '1rem',
        color: '#666',
        marginBottom: '10px',
        textAlign: 'left',
    },
    memberStatus: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#555',
    },
};

export default MembersPage;

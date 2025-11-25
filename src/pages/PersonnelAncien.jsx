import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PersonnelAncien = () => {
    const [members, setMembers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8000/api/members')
            .then(response => {
                const filteredMembers = response.data.filter(member => member.statut === 'Ancien');
                setMembers(filteredMembers);
            })
            .catch(() => {
                setError('Erreur lors de la récupération des anciens membres');
            });
    }, []);

    const handleProfileRedirect = (id) => {
        navigate(`/member/${id}`); // Redirects to /member/{id}
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Anciens membres de l'équipe L2IS</h1>
            <div style={styles.titleUnderline}></div>
            {error && <p style={styles.error}>{error}</p>}
            {members.length > 0 ? (
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Nom</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Position</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map(member => (
                                <tr key={member.id} style={styles.tableRow}>
                                    <td style={styles.td}>{member.name || 'Nom non disponible'}</td>
                                    <td style={styles.td}>{member.email || 'Email non disponible'}</td>
                                    <td style={styles.td}>{member.position || 'Position non disponible'}</td>
                                    <td style={styles.td}>
                                        <button style={styles.button} onClick={() => handleProfileRedirect(member.id)}>
                                            Voir Profil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p style={styles.noMembersText}>Aucun ancien membre disponible.</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#F9F9F9',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: '10px',
        color: '#333',
    },
    titleUnderline: {
        width: '610px',
        height: '6px',
        backgroundColor: '#87CEFA',
        margin: '0 auto 20px',
        borderRadius: '3px',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: '20px',
    },
    tableContainer: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        borderSpacing: '0',
    },
    th: {
        padding: '15px',
        textAlign: 'left',
        borderBottom: '2px solid #ddd',
        fontSize: '1.1rem',
    },
    td: {
        padding: '15px',
        borderBottom: '1px solid #ddd',
        fontSize: '1rem',
    },
    tableRow: {
        transition: 'background-color 0.3s, box-shadow 0.3s',
        '&:hover': {
            backgroundColor: '#f1f1f1',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
    },
    button: {
        padding: '8px 16px',
        backgroundColor: '#87CEFA',
        color: '#ffffff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'background-color 0.3s',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
    noMembersText: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#777',
    },
};

export default PersonnelAncien;

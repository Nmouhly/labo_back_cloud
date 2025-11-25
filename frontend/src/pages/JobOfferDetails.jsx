import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';

// Styles for the component
const styles = {
    jobOfferDetails: {
        background: 'linear-gradient(135deg, #e3f2fd, #ffffff)',
        borderRadius: '12px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
        padding: '30px',
        maxWidth: '800px',
        margin: '40px auto',
        fontFamily: "'Roboto', sans-serif",
        textAlign: 'center'
    },
    h2: {
        fontSize: '2.5rem',
        marginBottom: '20px',
        color: '#333'
    },
    p: {
        fontSize: '1.1rem',
        margin: '15px 0',
        color: '#555'
    },
    iconText: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        marginRight: '10px',
        color: '#00bfff'
    },
    strong: {
        fontWeight: 'bold',
        color: '#333'
    },
    applyButton: {
        display: 'inline-block',
        marginTop: '20px',
        padding: '12px 24px',
        fontSize: '1.1rem',
        color: '#fff',
        backgroundColor: '#00bfff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, transform 0.3s'
    },
    applyButtonHover: {
        backgroundColor: '#008ac7',
        transform: 'scale(1.05)'
    },
    applicationSuccess: {
        textAlign: 'center',
        padding: '30px',
        background: 'linear-gradient(135deg, #e3f2fd, #ffffff)',
        borderRadius: '12px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        margin: '40px auto'
    },
    homeLink: {
        display: 'inline-block',
        marginTop: '20px',
        padding: '12px 24px',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#00bfff',
        borderRadius: '8px',
        textDecoration: 'none',
        transition: 'background-color 0.3s, transform 0.3s'
    },
    homeLinkHover: {
        backgroundColor: '#008ac7',
        transform: 'scale(1.05)'
    },
    emailMessage: {
        marginTop: '30px',
        fontSize: '1.1rem',
        color: '#555'
    },
    emailLink: {
        color: 'white',
        textDecoration: 'none'
        
    }
};

const JobOfferDetails = () => {
    const { id } = useParams();
    const [jobOffer, setJobOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [applied, setApplied] = useState(false);

    useEffect(() => {
        const fetchJobOffer = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/job-offers/${id}`);
                setJobOffer(response.data);
            } catch (err) {
                setError('Erreur lors de la récupération des détails de l\'offre d\'emploi.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobOffer();
    }, [id]);

    if (loading) return <div style={styles.loading}>Chargement...</div>;
    if (error) return <div style={styles.error}>{error}</div>;

    if (applied) {
        return (
            <div style={styles.applicationSuccess}>
                <h2>Vous avez postulé avec succès !</h2>
                <p>Merci de votre intérêt pour ce poste.</p>
                <Link to="/" style={styles.homeLink}>Retour à l'accueil</Link>
            </div>
        );
    }

    if (!jobOffer) return <div className="not-found">Offre d'emploi introuvable.</div>;

    const handleApplyClick = () => {
        setApplied(true);
    };

    return (
        <div style={styles.jobOfferDetails}>
            <h2 style={styles.h2}>{jobOffer.title}</h2>
            <p><strong style={styles.strong}>Description:</strong> {jobOffer.description}</p>
            <p><strong style={styles.strong}>Exigences:</strong> {jobOffer.requirements}</p>
            <p style={styles.iconText}><FaMapMarkerAlt style={styles.icon} /> <strong style={styles.strong}>Location:</strong> {jobOffer.location}</p>
            <p style={styles.iconText}><FaDollarSign style={styles.icon} /> <strong style={styles.strong}>Salaire:</strong> {jobOffer.salary ? `$${jobOffer.salary}` : 'Non spécifié'}</p>
            <p style={styles.iconText}><FaCalendarAlt style={styles.icon} /> <strong style={styles.strong}>Date limite:</strong> {new Date(jobOffer.deadline).toLocaleDateString()}</p>
            <button
                style={applied ? { ...styles.applyButton, ...styles.applyButtonHover } : styles.applyButton}
                onClick={handleApplyClick}
            >
                <a 
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=l2is.uca@gmail.com&su=Candidature%20pour%20le%20poste&body=Bonjour,%20Veuillez%20trouver%20ci-joint%20mon%20CV%20et%20ma%20lettre%20de%20motivation.%20Cordialement."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.emailLink}
                >
                    Postuler
                </a>
                
            </button>
          
        </div>
    );
};

export default JobOfferDetails;

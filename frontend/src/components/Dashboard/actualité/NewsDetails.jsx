import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../context/authContext';

const NewsDetails = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);
    const navigate = useNavigate(); // Use navigate for navigation

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/news/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setNews(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'actualité', error);
                setError('Erreur lors de la récupération de l\'actualité');
            }
        };

        fetchNews();
    }, [id, accessToken]);

    const handleBackClick = () => {
        navigate('/'); // Navigate to the home page
    };

    return (
        <div style={styles.container}>
            {error && <p style={styles.error}>{error}</p>}
            {news ? (
                <div style={styles.newsContent}>
                    <h1 style={styles.title}>{news.title}</h1>
                    {news.image && (
                        <div style={styles.imageWrapper}>
                            <img 
                                src={`http://localhost:8000/storage/${news.image}`} 
                                alt={news.title} 
                                style={styles.image}
                            />
                        </div>
                    )}
                    <p style={styles.content}>{news.content}</p>
                    <button onClick={handleBackClick} style={styles.button}>
                    Retour à l'accueil
                    </button>
                </div>
            ) : (
                <p style={styles.loading}>Chargement...</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '20px auto',
        padding: '30px',
        fontFamily: "'Poppins', sans-serif",
        background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        animation: 'fadeIn 0.8s ease-in-out',
    },
    error: {
        color: '#ff6b6b',
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    newsContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    title: {
        fontSize: '2.4rem',
        fontWeight: '700',
        marginBottom: '20px',
        color: '#333',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
    },
    imageWrapper: {
        width: '70%',
        maxWidth: '500px',
        height: '300px',
        marginBottom: '20px',
        overflow: 'hidden',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        transition: 'transform 0.3s ease-in-out',
        cursor: 'pointer',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.3s ease-in-out',
        borderRadius: '15px',
    },
    content: {
        fontSize: '1.2rem',
        lineHeight: '1.8',
        color: '#555',
        textAlign: 'justify',
        marginTop: '20px',
    },
    loading: {
        fontSize: '1.6rem',
        fontWeight: 'bold',
        color: '#888',
        textAlign: 'center',
        marginTop: '50px',
    },
    button: {
        display: 'inline-block',
        marginTop: '20px',
        padding: '12px 24px',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#7bdae7',
        borderRadius: '8px',
        textDecoration: 'none',
        transition: 'background-color 0.3s, transform 0.3s'
    },
};

const fadeIn = `
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

${styles.imageWrapper}:hover .${styles.image} {
    transform: scale(1.05);
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = 'text/css';
styleSheet.innerText = fadeIn;
document.head.appendChild(styleSheet);

export default NewsDetails;

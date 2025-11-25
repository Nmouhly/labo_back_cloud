import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './HomeNews.css'; // Importer le fichier CSS

const HomeNews = () => {
    const [news, setNews] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/news')
            .then(response => {
                console.log('Données récupérées:', response.data); // Pour vérifier les données
                setNews(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des actualités', error);
                setError('Erreur lors de la récupération des actualités');
            });
    }, []);

    const getSnippet = (content) => {
        return content.length > 100 ? content.substring(0, 100) + '...' : content;
    };

    return (
        <div className="news-list">
            {error && <p>{error}</p>}
            {news.length > 0 ? (
                news.map(item => (
                    <div key={item.id} className="news-item">
                        {item.image ? (
                            <img 
                                src={item.image} // Utiliser l'URL de Cloudinary directement
                                alt={item.title} 
                                className="news-image" 
                            />
                        ) : (
                            <div className="news-image-placeholder" style={{ display: 'none' }}>
                                {/* Ne rien afficher si aucune image */}
                            </div>
                        )}
                        <div className="news-content">
                            <h2>{item.title}</h2>
                            <p className="news-snippet">{getSnippet(item.content)}</p>
                            <Link to={`/news/${item.id}`} className="news-button">Lire la suite</Link>
                        </div>
                    </div>
                ))
            ) : (
                <p>Aucune actualité disponible.</p>
            )}
        </div>
    );
};

export default HomeNews;

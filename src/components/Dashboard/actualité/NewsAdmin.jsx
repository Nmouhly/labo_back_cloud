import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';

// Function to strip HTML tags
const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

// Function to truncate text
const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

const NewsAdmin = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);
    const [expanded, setExpanded] = useState(null); // State to manage expanded items

    useEffect(() => {
        fetchNews();
    }, [accessToken]);

    const fetchNews = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/news', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (Array.isArray(response.data)) {
                setNewsItems(response.data);
            } else {
                console.error('Received data is not an array', response.data);
                setError('Error: Received data is not an array');
            }
        } catch (error) {
            const errorMessage = error.response 
                ? (error.response.data.message || 'Unknown server error') + ' - Code: ' + error.response.status
                : error.message || 'Unknown error';
            console.error('Error fetching news', errorMessage);
            setError('Error fetching news: ' + errorMessage);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this news?')) {
            try {
                await axios.delete(`http://localhost:8000/api/news/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setNewsItems(newsItems.filter(news => news.id !== id));
                toast.success('News deleted successfully');
            } catch (error) {
                console.error('Error deleting news', error);
                toast.error('Error deleting news');
            }
        }
    };

    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    return (
        <div className="container">
            <h1 className="my-4">Gestion des actualités </h1>
            <Link to="/dashboard/NewsCreate" className="btn btn-primary mb-4">Ajouter des actualites</Link>
            {error && <p className="text-danger">{error}</p>}
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="thead-light">
                        <tr>
                            <th>Titre</th>
                            <th>Contenu</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newsItems.length ? (
                            newsItems.map(news => (
                                <tr key={news.id}>
                                    <td>{news.title}</td>
                                    <td>
                                        {expanded === news.id ? 
                                            stripHtmlTags(news.content) 
                                            : truncateText(stripHtmlTags(news.content), 50)}
                                        <button onClick={() => toggleExpand(news.id)} className="btn btn-link">
                                            {expanded === news.id ? 'Collapse' : 'Read more'}
                                        </button>
                                    </td>
                                    <td>
                                        {news.image ? (
                                            <img
                                                src={news.image} // Use the image URL directly from Cloudinary
                                                alt={news.title}
                                                style={{ width: '100px', height: 'auto' }}
                                            />
                                        ) : (
                                            'No image'
                                        )}
                                    </td>
                                    <td>
                                        <Link to={`/dashboard/NewsEdit/${news.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                        <button onClick={() => handleDelete(news.id)} className="btn btn-danger mb-2">Supprimer</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No news available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NewsAdmin;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import arrowGif from '../assets/fleche.gif';

const JobOffersList = () => {
    const [jobOffers, setJobOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobOffers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/job-offers');
                setJobOffers(response.data);
            } catch (err) {
                setError('Erreur lors de la récupération des offres d\'emploi.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobOffers();
    }, []);

    const getSnippet = (description) => {
        return description.length > 100 ? description.substring(0, 100) + '...' : description;
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="job-offers-list">
             <div className="flex flex-col items-center">
                <h2 style={{ color: '#1A237E', fontSize: '2rem', marginTop: '2rem' }}>Offres d'Emploi</h2>
                <img
                    src={arrowGif}
                    alt="Flèche animée"
                    style={{ height: '60px', width: 'auto' }} // Ajustez la taille selon vos besoins
                />
            </div>
            {jobOffers.length > 0 ? (
                jobOffers.map(offer => (
                    <div key={offer.id} className="job-offer-item">
                        <h2>{offer.title}</h2>
                        <p className="job-offer-snippet">{getSnippet(offer.description)}</p>
                        <p><FaMapMarkerAlt className="icon" /> {offer.location}</p>
                        <p><FaCalendarAlt className="icon" /> {new Date(offer.deadline).toLocaleDateString()}</p>
                        <Link to={`/job-offers/${offer.id}`} className="job-offer-button">Lire la suite</Link>
                    </div>
                ))
            ) : (
                <p>Aucune offre d'emploi disponible.</p>
            )}
        </div>
    );
};

// Amélioration du style CSS
const style = `
    .job-offers-list {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
        padding: 20px;
    }

    .job-offer-item {
        background: linear-gradient(135deg, #f0f4f8, #ffffff);
        border-radius: 12px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        padding: 20px;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .job-offer-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    }

    h2 {
        font-size: 1.6rem;
        margin-bottom: 15px;
        color: #333;
    }

    .job-offer-snippet {
        color: #555;
        margin-bottom: 20px;
        font-size: 1rem;
        line-height: 1.5;
    }

    .job-offer-item p {
        margin: 5px 0;
        font-size: 1rem;
        display: flex;
        align-items: center;
        color: #444;
    }

    .icon {
        margin-right: 8px;
        color: #00bfff;
    }

    .job-offer-button {
        display: inline-block;
        background-color: #00bfff;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        text-decoration: none;
        font-size: 1rem;
        font-weight: bold;
        transition: background-color 0.3s, transform 0.3s;
    }

    .job-offer-button:hover {
        background-color: #008ac7;
        transform: translateY(-2px);
    }
`;

const sheet = document.createElement('style');
sheet.innerHTML = style;
document.head.appendChild(sheet);

export default JobOffersList;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const JobOfferAdmin = () => {
    const [jobOffers, setJobOffers] = useState([]);
    const [error, setError] = useState('');
    const [expandedTitle, setExpandedTitle] = useState({}); // Track expanded state for titles
    const [expandedDescription, setExpandedDescription] = useState({}); // Track expanded state for descriptions
    const [expandedRequirements, setExpandedRequirements] = useState({}); // Track expanded state for requirements
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchJobOffers();
    }, [accessToken]);

    const fetchJobOffers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/job-offers', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setJobOffers(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des offres d\'emploi', error);
            setError('Erreur lors de la récupération des offres d\'emploi');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre d\'emploi ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/job-offers/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setJobOffers(jobOffers.filter(jobOffer => jobOffer.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'offre d\'emploi', error);
                setError('Erreur lors de la suppression de l\'offre d\'emploi');
            }
        }
    };

    const truncateText = (text, length) => {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    };

    const formatSalary = (salary) => {
        const numSalary = parseFloat(salary);
        return !isNaN(numSalary) ? numSalary.toFixed(2) : 'N/A';
    };

    const toggleExpandTitle = (id) => {
        setExpandedTitle(prevState => ({
            ...prevState,
            [id]: !prevState[id] // Toggle the expanded state for the specific job offer's title
        }));
    };

    const toggleExpandDescription = (id) => {
        setExpandedDescription(prevState => ({
            ...prevState,
            [id]: !prevState[id] // Toggle the expanded state for the specific job offer's description
        }));
    };

    const toggleExpandRequirements = (id) => {
        setExpandedRequirements(prevState => ({
            ...prevState,
            [id]: !prevState[id] // Toggle the expanded state for the specific job offer's requirements
        }));
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Gestion des Offres d'Emploi</h1>
            <Link to="/dashboard/JobOfferCreate" className="btn btn-primary mb-4">Ajouter une Offre</Link>
            {error && <p className="alert alert-danger">{error}</p>}
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Titre</th>
                        <th scope="col">Description</th>
                        <th scope="col">Exigences</th>
                        <th scope="col">Lieu</th>
                        <th scope="col">Salaire</th>
                        <th scope="col">Date Limite</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {jobOffers.length ? (
                        jobOffers.map(jobOffer => (
                            <tr key={jobOffer.id}>
                                <td>
                                   
                                    {jobOffer.title }
                                </td>
                                <td>
                                    {expandedDescription[jobOffer.id] ? jobOffer.description : truncateText(jobOffer.description, 20)}
                                    {jobOffer.description.length > 20 && !expandedDescription[jobOffer.id] && (
                                        <span 
                                            onClick={() => toggleExpandDescription(jobOffer.id)} 
                                            className="text-primary cursor-pointer ml-1">Lire la suite</span>
                                    )}
                                </td>
                                <td>
                                    {expandedRequirements[jobOffer.id] ? jobOffer.requirements : truncateText(jobOffer.requirements, 20)}
                                    {jobOffer.requirements.length > 20 && !expandedRequirements[jobOffer.id] && (
                                        <span 
                                            onClick={() => toggleExpandRequirements(jobOffer.id)} 
                                            className="text-primary cursor-pointer ml-1">Lire la suite</span>
                                    )}
                                </td>
                                <td>{truncateText(jobOffer.location, 20)}</td>
                                <td>{formatSalary(jobOffer.salary)}</td>
                                <td>{new Date(jobOffer.deadline).toLocaleDateString()}</td>
                                <td>
                                <div className="d-flex justify-content-between">                                    <Link to={`/dashboard/JobOfferEdit/${jobOffer.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                    <button onClick={() => handleDelete(jobOffer.id)} className="btn btn-danger mb-2">Supprimer</button></div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">Aucune offre d'emploi disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default JobOfferAdmin;

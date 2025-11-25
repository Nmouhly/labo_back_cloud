import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const ProjectsAdmin = () => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);
    
    // State to track expanded titles and descriptions
    const [expandedTitle, setExpandedTitle] = useState({});
    const [expandedDescription, setExpandedDescription] = useState({});

    useEffect(() => {
        fetchProjects();
    }, [accessToken]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/projects', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setProjects(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des projets', error);
            setError('Erreur lors de la récupération des projets');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/projects/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setProjects(projects.filter(project => project.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression du projet', error);
                setError('Erreur lors de la suppression du projet');
            }
        }
    };

    const truncateText = (text, length) => {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    };

    const toggleExpandTitle = (id) => {
        setExpandedTitle(prevState => ({
            ...prevState,
            [id]: !prevState[id] // Toggle the expanded state for the specific project title
        }));
    };

    const toggleExpandDescription = (id) => {
        setExpandedDescription(prevState => ({
            ...prevState,
            [id]: !prevState[id] // Toggle the expanded state for the specific project description
        }));
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Gérer les Projets</h1>
            <Link to="/dashboard/ProjectsCreate" className="btn btn-primary mb-4">Ajouter un Projet</Link>
            {error && <p className="text-danger">{error}</p>}
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Titre</th>
                            <th scope="col">Description</th>
                            <th scope="col">Équipe</th>
                            <th scope="col">Date de début</th>
                            <th scope="col">Date de fin</th>
                            <th scope="col">Type de financement</th>
                            <th scope="col">Statut</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length ? (
                            projects.map(project => (
                                <tr key={project.id}>
                                    <td>
                                        
                                        {project.title}</td>
                                          
                                    <td>
                                        {expandedDescription[project.id] ? project.description : truncateText(project.description, 40)}
                                        {project.description.length > 40 && !expandedDescription[project.id] && (
                                            <span 
                                                onClick={() => toggleExpandDescription(project.id)} 
                                                className="text-primary cursor-pointer ml-1">
                                                Lire la suite
                                            </span>
                                        )}
                                    </td>
                                    <td>{project.team}</td>
                                    <td>{project.start_date}</td>
                                    <td>{project.end_date}</td>
                                    <td>{project.funding_type}</td>
                                    <td>{project.status}</td>
                                    <td>
                                        <div className="d-flex justify-content-between">
                                            <Link 
                                                to={`/dashboard/ProjectsEdit/${project.id}`} 
                                                className="btn btn-primary btn-sm mb-2">
                                                Modifier
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(project.id)} 
                                                className="btn btn-danger btn-sm mb-2">
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center">Aucun projet disponible</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectsAdmin;

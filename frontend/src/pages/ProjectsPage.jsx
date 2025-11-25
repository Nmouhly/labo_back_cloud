import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProjectsPage.css'; // Import the CSS file

const ProjectsPage = () => {
    const [ongoingProjects, setOngoingProjects] = useState([]);
    const [completedProjects, setCompletedProjects] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const ongoingResponse = await axios.get('http://localhost:8000/api/projects/ongoing');
            console.log('Ongoing projects response:', ongoingResponse.data);
            setOngoingProjects(ongoingResponse.data);
        } catch (err) {
            console.error("Error fetching ongoing projects:", err);
            setError('Erreur lors de la récupération des projets en cours');
        }

        try {
            const completedResponse = await axios.get('http://localhost:8000/api/projects/completed');
            console.log('Completed projects response:', completedResponse.data);
            setCompletedProjects(completedResponse.data);
        } catch (err) {
            console.error("Error fetching completed projects:", err);
            setError('Erreur lors de la récupération des projets terminés');
        }
    };

    return (
        <div className="projects-page">
            <h1>Projets</h1>
            {error && <p className="error">{error}</p>}

            <h2>Projets en cours</h2>
            <div className="projects ongoing">
                {ongoingProjects.length > 0 ? (
                    ongoingProjects.map(project => (
                        <div className="project-card" key={project.id}>
                            <h3>{project.title || 'Titre non disponible'}</h3>
                            <p><strong>Description:</strong> {project.description || 'Description non disponible'}</p>
                            <p><strong>Équipe:</strong> {project.team || 'Équipe non disponible'}</p>
                            <p><strong>Date de début:</strong> {new Date(project.start_date).toLocaleDateString() || 'Date non disponible'}</p>
                            <p><strong>Date de fin:</strong> {new Date(project.end_date).toLocaleDateString() || 'Date non disponible'}</p>
                            <p><strong>Type de financement:</strong> {project.funding_type || 'Type non disponible'}</p>
                        </div>
                    ))
                ) : (
                    <p>Aucun projet en cours.</p>
                )}
            </div>

            <h2>Projets terminés</h2>
            <div className="projects completed">
                {completedProjects.length > 0 ? (
                    completedProjects.map(project => (
                        <div className="project-card" key={project.id}>
                            <h3>{project.title || 'Titre non disponible'}</h3>
                            <p><strong>Description:</strong> {project.description || 'Description non disponible'}</p>
                            <p><strong>Équipe:</strong> {project.team || 'Équipe non disponible'}</p>
                            <p><strong>Date de début:</strong> {new Date(project.start_date).toLocaleDateString() || 'Date non disponible'}</p>
                            <p><strong>Date de fin:</strong> {new Date(project.end_date).toLocaleDateString() || 'Date non disponible'}</p>
                            <p><strong>Type de financement:</strong> {project.funding_type || 'Type non disponible'}</p>
                        </div>
                    ))
                ) : (
                    <p>Aucun projet terminé.</p>
                )}
            </div>
        </div>
    );
};

export default ProjectsPage;

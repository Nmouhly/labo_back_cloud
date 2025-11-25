import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Seminar from './Seminar'; // Assurez-vous que le chemin est correct
import Conference from './Conference'; // Assurez-vous que le chemin est correct

const Evenements = () => {
  const [upcomingProjects, setUpcomingProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUpcomingProjects();
  }, []);

  const fetchUpcomingProjects = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/projects/ongoing');
      setUpcomingProjects(response.data);
    } catch (err) {
      console.error('Error fetching upcoming projects:', err);
      setError('Erreur lors de la récupération des projets à venir');
    }
  };

  // Style object for the project container with decreased size
  const projectContainerStyle = {
    maxWidth: '860px', // Decreased by 23px from 300px (300px - 23px)
    padding: '15px', // Maintain padding
    margin: '10px auto', // Center the container with space around it
    border: '1px  #ccc', // Border for visibility
    borderRadius: '5px', // Slightly round the corners
    boxShadow: '0 5px 5px rgba(0, 0, 0, 0.1)', // Subtle shadow
  };

  // Style object for the title
  const titleStyle = {
    marginLeft: '280px', // Déplacer le titre de 280px vers la droite
    borderBottom: '2px solid #B0E0E6', // Ajouter une ligne sous le texte
    paddingBottom: '15px', // Ajouter un espace entre le texte et la ligne
    maxWidth:'170px'
  };
  
  const titlee= {
    marginLeft: '750px',
    borderBottom: '2px solid #d7005a', // Ajouter une ligne sous le texte
    paddingBottom: '15px', // Ajouter un espace entre le texte et la ligne
    marginBottom:'20px',
    maxWidth:'260px'
  };

  return (
    <div>
      <Seminar />
      <h1 style={titlee}>Projets à venir</h1>
      {/* <h2 style={titleStyle}>Projets à venir</h2> */}
      <div className="projects upcoming">
        {error && <p className="error">{error}</p>}
        {upcomingProjects.length > 0 ? (
          upcomingProjects.map(project => (
            <div className="project-card" key={project.id} style={projectContainerStyle}>
              <h3>{project.title || 'Titre non disponible'}</h3>
              <p><strong>Description:</strong> {project.description || 'Description non disponible'}</p>
              <p><strong>Équipe:</strong> {project.team || 'Équipe non disponible'}</p>
              <p><strong>Date de début:</strong> {new Date(project.start_date).toLocaleDateString() || 'Date non disponible'}</p>
              <p><strong>Date de fin:</strong> {new Date(project.end_date).toLocaleDateString() || 'Date non disponible'}</p>
              <p><strong>Type de financement:</strong> {project.funding_type || 'Type non disponible'}</p>
            </div>
          ))
        ) : (
          <p>Aucun projet à venir.</p>
        )}
      </div>
      <Conference />

     
    </div>
  );
};

export default Evenements;

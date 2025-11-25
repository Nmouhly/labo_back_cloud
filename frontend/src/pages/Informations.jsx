import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JobOffersList from '../pages/JobOffersList';
import Organisation from '../pages/Organisation';
import arrowGif from '../assets/fleche.gif';

const Informations = () => {
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
  const projectContainerStyle = {
  
    maxWidth: '1380px', // Decreased by 23px from 300px (300px - 23px)
    padding: '15px', // Maintain padding
    margin: '10px auto', // Center the container with space around it
    border: '1px  #ccc', // Border for visibility
    borderRadius: '10px', // Slightly round the corners
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow
    background: 'linear-gradient(135deg, #f0f4f8, #ffffff)',
  };
  const organisationContainerStyle = {
    maxWidth: '86%', // Full width
    margin: '20px auto',
    padding: '20px',
    transform: 'scale(1.2)', // Scale up the Organisation component to increase its size
  };
  // Style object for the title
  const titleStyle = {
    marginLeft: '140px', // Move the title 25px to the right
    textDecoration: 'underline', // Add underline
    textDecorationColor: '#B0E0E6', // Set underline color
  };


   

    return (
      <div>

            <JobOffersList />
            <div className="flex flex-col items-center">
                <h2 style={{ color: '#1A237E', fontSize: '2rem', marginTop: '2rem' }}>Projets à venir</h2>
                <img
                    src={arrowGif}
                    alt="Flèche animée"
                    style={{ height: '60px', width: 'auto' }} // Ajustez la taille selon vos besoins
                />
            </div>
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
      <div style={organisationContainerStyle}>
        <Organisation />
      </div>
           
      
        </div>
    );
};

export default Informations;

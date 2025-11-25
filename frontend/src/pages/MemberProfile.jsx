import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import defaultImage from '../assets/photo.png';
import { FaEnvelope, FaUserGraduate, FaBuilding } from 'react-icons/fa';

const MemberProfile = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [ouvrages, setOuvrages] = useState([]);
  const [revues, setRevues] = useState([]);
  const [habilitations, setHabilitations] = useState([]);
  const [rapports, setRapports] = useState([]);
  const [theses, setTheses] = useState([]);
  const [brevets, setBrevets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const memberResponse = await axios.get(`http://localhost:8000/api/members/${id}`);
        setMember(memberResponse.data);
        
        const userId = memberResponse.data.user_id;

        const ouvragesResponse = await axios.get(`http://localhost:8000/api/ouvrages/user-or-contributor/${userId}`);
        setOuvrages(ouvragesResponse.data);
        
        const revuesResponse = await axios.get(`http://localhost:8000/api/revues/user-or-contributor/${userId}`);
        setRevues(revuesResponse.data);
        
        const habilitationsResponse = await axios.get(`http://localhost:8000/api/habilitations/user-or-contributor/${userId}`);
        setHabilitations(habilitationsResponse.data);
        
        const rapportsResponse = await axios.get(`http://localhost:8000/api/rapports/user-or-contributor/${userId}`);
        setRapports(rapportsResponse.data);
        
        const thesesResponse = await axios.get(`http://localhost:8000/api/theses/user-or-contributor/${userId}`);
        setTheses(thesesResponse.data);
        
        const brevetsResponse = await axios.get(`http://localhost:8000/api/brevets/user-or-contributor/${userId}`);
        setBrevets(brevetsResponse.data);
        
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setError('Erreur lors de la récupération du profil membre ou des publications.');
      }
    };

    fetchData();
  }, [id]);

  const handleImageError = (e) => {
    e.target.onerror = null; 
    e.target.src = defaultImage; 
  };

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div style={styles.container}>
      {member ? (
        <>
          <div style={styles.profileWrapper}>
            <img
              src={member.image || defaultImage} 
              alt={member.name || 'Image de membre'}
              className="profile-image"
              onError={handleImageError}
              style={styles.profileImage}
            />
            <h2 style={styles.name}>{member.name}</h2>
            <div style={styles.infoContainer}>
              {member.position && (
                <div style={styles.infoItem}>
                  <FaUserGraduate style={styles.icon} />
                  <span>{member.position}</span>
                </div>
              )}
              {member.bio && (
                <div style={styles.infoItem}>
                  <FaBuilding style={styles.icon} />
                  <span>{member.bio}</span>
                </div>
              )}
              {member.email && (
                <div style={styles.infoItem}>
                  <FaEnvelope style={styles.icon} />
                  <span>{member.email}</span>
                </div>
              )}
            </div>

            {/* Affichage des publications */}
            <div style={styles.publicationsContainer}>
              {ouvrages.length > 0 && (
                <div style={styles.publicationsItem}>
                  <h3 style={styles.publicationsTitle}>Ouvrages</h3>
                  <hr style={styles.sectionDivider} />
                  <ul style={styles.publicationList}>
                    {ouvrages.map(ouvrage => (
                      <li key={ouvrage.id} style={styles.publicationListItem}>
                        <strong style={styles.boldTitle}>{ouvrage.title || 'Titre non disponible'}.</strong> 
                        <span style={styles.greyAuthor}>{ouvrage.author || 'Auteur non disponible'}.</span>
                        <a href={`https://doi.org/${ouvrage.DOI}`} target="_blank" rel="noopener noreferrer" className="doi-link"> DOI</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {revues.length > 0 && (
                <div style={styles.publicationsItem}>
                  <h3 style={styles.publicationsTitle}>Revues</h3>
                  <hr style={styles.sectionDivider} />
                  <ul style={styles.publicationList}>
                    {revues.map(revue => (
                      <li key={revue.id} style={styles.publicationListItem}>
                        <strong style={styles.boldTitle}>{revue.title || 'Titre non disponible'}.</strong> 
                        <span style={styles.greyAuthor}>{revue.author || 'Auteur non disponible'}.</span>
                        <a href={`https://doi.org/${revue.DOI}`} target="_blank" rel="noopener noreferrer" className="doi-link"> DOI</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {habilitations.length > 0 && (
                <div style={styles.publicationsItem}>
                  <h3 style={styles.publicationsTitle}>Habilitations</h3>
                  <hr style={styles.sectionDivider} />
                  <ul style={styles.publicationList}>
                    {habilitations.map(habilitation => (
                      <li key={habilitation.id} style={styles.publicationListItem}>
                        <strong style={styles.boldTitle}>{habilitation.title || 'Titre non disponible'}.</strong> 
                        <span style={styles.greyAuthor}>{habilitation.author || 'Auteur non disponible'}.</span>
                        <a href={`https://doi.org/${habilitation.doi}`} target="_blank" rel="noopener noreferrer" className="doi-link"> DOI</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {rapports.length > 0 && (
                <div style={styles.publicationsItem}>
                  <h3 style={styles.publicationsTitle}>Rapports</h3>
                  <hr style={styles.sectionDivider} />
                  <ul style={styles.publicationList}>
                    {rapports.map(rapport => (
                      <li key={rapport.id} style={styles.publicationListItem}>
                        <strong style={styles.boldTitle}>{rapport.title || 'Titre non disponible'}.</strong> 
                        <span style={styles.greyAuthor}>{rapport.author || 'Auteur non disponible'}.</span>
                        <a href={`https://doi.org/${rapport.DOI}`} target="_blank" rel="noopener noreferrer" className="doi-link"> DOI</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {theses.length > 0 && (
                <div style={styles.publicationsItem}>
                  <h3 style={styles.publicationsTitle}>Thèses</h3>
                  <hr style={styles.sectionDivider} />
                  <ul style={styles.publicationList}>
                    {theses.map(these => (
                      <li key={these.id} style={styles.publicationListItem}>
                        <strong style={styles.boldTitle}>{these.title || 'Titre non disponible'}.</strong> 
                        <span style={styles.greyAuthor}>{these.author || 'Auteur non disponible'}.</span>
                        <a href={`https://doi.org/${these.doi}`} target="_blank" rel="noopener noreferrer" className="doi-link"> DOI</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {brevets.length > 0 && (
                <div style={styles.publicationsItem}>
                  <h3 style={styles.publicationsTitle}>Brevets</h3>
                  <hr style={styles.sectionDivider} />
                  <ul style={styles.publicationList}>
                    {brevets.map(brevet => (
                      <li key={brevet.id} style={styles.publicationListItem}>
                        <strong style={styles.boldTitle}>{brevet.title || 'Titre non disponible'}.</strong> 
                        <span style={styles.greyAuthor}>{brevet.author || 'Auteur non disponible'}.</span>
                        <a href={`https://doi.org/${brevet.doi}`} target="_blank" rel="noopener noreferrer" className="doi-link"> DOI</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>Chargement des informations du membre...</p>
      )}
    </div>
  );
};

// Styles
const styles = {
  publicationsTitle: {
    margin: '10px 0',
    fontSize: '1.5rem',
    fontWeight: '600',
    textAlign: 'left',
    color: '#333',
  },
  container: {
    padding: '40px',
    maxWidth: '900px',
    margin: '0 auto',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  profileWrapper: {
    marginBottom: '40px',
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    marginBottom: '20px',
  },
  name: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '10px 0',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Align items to the left
    marginBottom: '20px',
  },
  infoItem: {
    margin: '10px 0',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
    color: '#555',
  },
  icon: {
    marginRight: '8px',
  },
  publicationsContainer: {
    textAlign: 'left',
  },
  publicationsItem: {
    marginBottom: '30px',
  },
  sectionDivider: {
    border: '2px solid #05a7bd',
    width: '175px',
    margin: '-1px left',
  },
  publicationList: {
    listStyleType: 'none', // Remove default list style
    padding: '0', // Remove padding
  },
  publicationListItem: {
    margin: '10px 0',
  },
  boldTitle: {
    fontWeight: 'bold', // Title in bold
  },
  greyAuthor: {
    color: '#999', // Authors in gray
    marginLeft: '5px',
  },
};

export default MemberProfile;

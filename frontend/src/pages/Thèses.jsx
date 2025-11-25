import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Thèses.css'; // Assurez-vous que le fichier CSS est bien importé
import logoDoctorat from '../assets/doctorat.png'; // Importation de l'image
import Habilitation from './Habilitation';

const Thèses = () => {
  const [theses, setTheses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/these/acceptes');
        setTheses(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des thèses', error);
        setError(
          `Erreur lors du chargement des thèses : ${error.response?.status} - ${
            error.response?.statusText || error.message
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTheses();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="these-container">
      <h1>Thèses et Doctorat</h1>
      {/* Message si aucune thèse n'est disponible */}
      {theses.length === 0 ? (
        <p>Aucune thèse disponible</p>
      ) : (
        <ul className="these-list">
          {theses.map((these) => (
            <li key={these.id} className="these-card">
              <div className="these-header">
                <img
                  src={logoDoctorat} // Utilisation de l'image importée
                  alt="Chapeau de Doctorat"
                  className="these-logo"
                />
              </div>
              <div className="these-content">
                <p className="these-info"><strong>Titre:</strong> {these.title}</p>
                <p className="these-info"><strong>Auteur:</strong> {these.author}</p>
                <p className="these-info"><strong>Date:</strong> {new Date(these.date).toLocaleDateString()}</p>
                <p className="these-info"><strong>Lieu:</strong> {these.lieu || 'Non spécifié'}</p>
                {these.doi && (
                  <p className="these-info">
                    <strong>DOI:</strong>
                    <a
                      href={`https://doi.org/${these.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {these.doi}
                    </a>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <Habilitation />
    </div>
  );
};

export default Thèses;

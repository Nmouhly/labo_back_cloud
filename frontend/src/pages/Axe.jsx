import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { decode } from 'html-entities';
import arrowGif from '../assets/fleche.gif'; // Assurez-vous que le GIF est dans le bon dossier

const Axe = () => {
  const [axes, setAxes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAxes();
  }, []);

  const fetchAxes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/axes');
      if (Array.isArray(response.data)) {
        setAxes(response.data);
      } else {
        console.error('Les données reçues ne sont pas un tableau');
        setError('Erreur de données');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des axes', error);
      setError('Erreur lors de la récupération des axes');
    }
  };

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Axes de Recherche du Laboratoire L2IS</h1>
        <p className="text-lg text-gray-700">
          Le laboratoire L2IS se consacre à la recherche avancée dans plusieurs domaines clés. Découvrez nos axes de recherche ci-dessous.
        </p>
        <img src={arrowGif} alt="Fleche animée" className="mx-auto my-4" />
      </header>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {axes.length ? (
        axes.map(axe => (
          <section key={axe.id} className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">{stripHtmlTags(decode(axe.title))}</h2>
            <p>{stripHtmlTags(decode(axe.content))}</p>
          </section>
        ))
      ) : (
        <p className="text-center">Aucun axe disponible pour le moment.</p>
      )}
    </div>
  );
};

export default Axe;

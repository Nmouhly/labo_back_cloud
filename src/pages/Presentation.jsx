import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { decode } from 'html-entities'; // Pour décoder les entités HTML

const Presentation = () => {
    const [presentations, setPresentations] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPresentations();
    }, []);

    const fetchPresentations = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/presentations');
            if (Array.isArray(response.data)) {
                setPresentations(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau', response.data);
                setError('Erreur de données : Les données reçues ne sont pas un tableau');
            }
        } catch (error) {
            const errorMessage = error.response 
                ? (error.response.data.message || 'Erreur inconnue du serveur') + ' - Code: ' + error.response.status
                : error.message || 'Erreur inconnue';
            console.error('Erreur lors de la récupération des présentations', errorMessage);
            setError('Erreur lors de la récupération des présentations : ' + errorMessage);
        }
    };

    // Fonction pour enlever les balises HTML
    const stripHtmlTags = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Présentation de l’Équipe L2IS</h1>
                <p className="text-lg text-gray-700">
                    Découvrez les détails des présentations de notre équipe ci-dessous.
                </p>
            </header>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {presentations.length ? (
                presentations.map(presentation => (
                    <section key={presentation.id} className="mb-8">
                        <h2 className="text-3xl font-semibold mb-4">{stripHtmlTags(decode(presentation.title))}</h2>
                        <p>{stripHtmlTags(decode(presentation.content))}</p>
                    </section>
                ))
            ) : (
                <p className="text-center">Aucune présentation disponible pour le moment.</p>
            )}
        </div>
    );
};

export default Presentation;

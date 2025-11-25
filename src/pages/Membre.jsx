import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Membre.css'; // Importer le fichier CSS

const Membre = () => {
    const [members, setMembers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/members')
            .then(response => {
                console.log('Données récupérées:', response.data); // Pour vérifier les données
                // Filtrer les membres pour ne garder que ceux avec le statut "membre"
                const filteredMembers = response.data.filter(member => member.statut === 'membre');
                setMembers(filteredMembers);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des membres', error);
                setError('Erreur lors de la récupération des membres');
            });
    }, []);

    return (
        <div className="members-table">
            <h1>Membres d'équipe L2IS</h1>
            {error && <p className="error">{error}</p>}
            {members.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Nom</th>
                            <th>Position</th>
                            <th>Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(member => (
                            <tr key={member.id}>
                                <td>
                                    {member.image ? (
                                        <img 
                                            src={member.image} 
                                            alt={`${member.name}`} 
                                            className="member-image" 
                                        />
                                    ) : (
                                        'Image non disponible'
                                    )}
                                </td>
                                <td>{member.name || 'Nom non disponible'}</td>
                                <td>{member.position || 'Position non disponible'}</td>
                                <td>{member.contact_info || 'Non disponible'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Aucun membre disponible.</p>
            )}
        </div>
    );
};

export default Membre;

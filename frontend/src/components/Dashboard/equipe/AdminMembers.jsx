import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const MembreAdmin = () => {
    const [members, setMembers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [expandedBio, setExpandedBio] = useState({});
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchMembers();
        fetchTeams();
    }, [accessToken]);

    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/members', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setMembers(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des membres', error);
            setError('Erreur lors de la récupération des membres');
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/equipe', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setTeams(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des équipes', error);
            setError('Erreur lors de la récupération des équipes');
        }
    };

    const getTeamNameById = (id) => {
        const team = teams.find(team => team.id === id);
        return team ? team.name : 'Inconnu';
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/members/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setMembers(members.filter(member => member.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression du membre', error);
                setError('Erreur lors de la suppression du membre');
            }
        }
    };

    const toggleBio = (id) => {
        setExpandedBio(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    return (
        <div className="container">
            <h1 className="my-4">Gestion des Membres</h1>
            <Link to="/dashboard/MembreCreate" className="btn btn-primary mb-4">Ajouter un Membre</Link>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Image</th>
                            <th scope="col">Nom</th>
                            <th scope="col">Poste</th>
                            <th scope="col">Bio</th>
                            <th scope="col">Infos de Contact</th>
                            <th scope="col">Équipe</th>
                            <th scope="col">Statut</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.length ? (
                            members.map(member => (
                                <tr key={member.id}>
                                    <td>
                                        {member.image ? (
                                            <img 
                                                src={member.image} 
                                                alt={member.name} 
                                                className="img-thumbnail" 
                                                style={{ width: '60px', height: '60px' }} 
                                            />
                                        ) : (
                                            <div 
                                                className="bg-secondary rounded-circle" 
                                                style={{ width: '60px', height: '60px' }}>
                                            </div>
                                        )}
                                    </td>
                                    <td>{member.name}</td>
                                    <td>{member.position}</td>
                                    <td>
                                        <div>
                                            {expandedBio[member.id] 
                                                ? member.bio 
                                                : `${member.bio.substring(0, 50)}...`}
                                            {member.bio.length > 50 && (
                                                <span 
                                                    onClick={() => toggleBio(member.id)} 
                                                    className="text-primary cursor-pointer ml-1">
                                                    {expandedBio[member.id] ? 'Lire moins' : 'Lire suite'}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>{member.contact_info}</td>
                                    <td>{getTeamNameById(member.team_id)}</td>
                                    <td>{member.statut}</td>
                                    <td>
                                        <Link to={`/dashboard/MembreEdit/${member.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                        <button onClick={() => handleDelete(member.id)} className="btn btn-danger mb-2">Supprimer</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center">Aucun membre disponible</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MembreAdmin;

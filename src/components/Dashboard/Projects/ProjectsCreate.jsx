import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';

const ProjectsCreate = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [team, setTeam] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [fundingType, setFundingType] = useState('');
    const [status, setStatus] = useState('en_cours');
    const [teams, setTeams] = useState([]); // State for teams
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);

    // Fetch teams from API
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/equipe', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setTeams(response.data); // Assuming response.data is an array of team objects
            } catch (error) {
                console.error('Erreur lors de la récupération des équipes', error.response || error.message);
                setError('Erreur lors de la récupération des équipes. Veuillez réessayer.');
                toast.error('Erreur lors de la récupération des équipes.');
            }
        };

        fetchTeams();
    }, [accessToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newProject = {
            title,
            description,
            team,
            start_date: startDate,
            end_date: endDate,
            funding_type: fundingType,
            status,
        };

        try {
            const response = await axios.post('http://localhost:8000/api/projects', newProject, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            console.log('Projet créé:', response.data);
            toast.success('Projet créé avec succès');
            navigate('/dashboard/ProjectsAdmin');
        } catch (error) {
            console.error('Erreur lors de la création du projet', error.response || error.message);
            setError('Erreur lors de la création du projet. Veuillez réessayer.');
            toast.error('Erreur lors de la création du projet.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Créer un Nouveau Projet</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Titre</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Équipe</label>
                    <select 
                        value={team} 
                        onChange={(e) => setTeam(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">Sélectionner une équipe</option>
                        {teams.map((team) => (
                            <option key={team.id} value={team.name}>{team.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Date de début</label>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Date de fin</label>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Type de financement</label>
                    <input 
                        type="text" 
                        value={fundingType} 
                        onChange={(e) => setFundingType(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Statut</label>
                    <select 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="En Cours">En Cours</option>
                        <option value="Terminé">Terminé</option>
                    </select>
                </div>
                <button 
          type="submit" 
          className="bg-green-500 text-white py-1 px-4  rounded hover:bg-green-600"
        >
          Ajouter
        </button>
            </form>
        </div>
    );
};

export default ProjectsCreate;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';

const ProjectsEdit = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [team, setTeam] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [fundingType, setFundingType] = useState('');
    const [status, setStatus] = useState('en_cours'); // New state for status
    const [teams, setTeams] = useState([]); // New state for teams
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/projects/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const project = response.data;
                setTitle(project.title);
                setDescription(project.description);
                setTeam(project.team);
                setStartDate(project.start_date);
                setEndDate(project.end_date);
                setFundingType(project.funding_type);
                setStatus(project.status); // Set status from response
            } catch (error) {
                console.error('Erreur lors de la récupération du projet', error.response || error.message);
                setError('Erreur lors de la récupération du projet. Veuillez réessayer.');
                toast.error('Erreur lors de la récupération du projet.');
            }
        };

        fetchProject();
    }, [id, accessToken]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/equipe', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setTeams(response.data); // Store the fetched teams
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

        const updatedProject = {
            title,
            description,
            team,
            start_date: startDate,
            end_date: endDate,
            funding_type: fundingType,
            status, // Include status in updated project
        };

        try {
            const response = await axios.put(`http://localhost:8000/api/projects/${id}`, updatedProject, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            console.log('Projet modifié:', response.data);
            toast.success('Projet modifié avec succès');
            navigate('/dashboard/ProjectsAdmin');
        } catch (error) {
            console.error('Erreur lors de la modification du projet', error.response || error.message);
            setError('Erreur lors de la modification du projet. Veuillez réessayer.');
            toast.error('Erreur lors de la modification du projet.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Modifier le Projet</h1>
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
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Mettre à jour
                </button>
            </form>
        </div>
    );
};

export default ProjectsEdit;

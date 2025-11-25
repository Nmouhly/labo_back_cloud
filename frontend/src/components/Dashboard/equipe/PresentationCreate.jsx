import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const PresentationCreate = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');
    const [teams, setTeams] = useState([]);
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
                setTeams(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des équipes', error);
                setError('Erreur lors de la récupération des équipes.');
                toast.error('Erreur lors de la récupération des équipes.');
            }
        };

        fetchTeams();
    }, [accessToken]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:8000/api/presentations', {
                title,
                content,
                team_id: selectedTeam // Envoi de team_id avec les données
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            toast.success('Présentation ajoutée avec succès');
            navigate('/dashboard/PresentationAdmin'); // Redirige vers la liste des présentations
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la présentation', error.response || error.message);
            setError('Erreur lors de l\'ajout de la présentation. Veuillez réessayer.');
            toast.error('Erreur lors de l\'ajout de la présentation.');
        }
    };

    // Handle back button click
    const handleBack = () => {
        navigate('/dashboard/presentation');
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Ajouter une Présentation</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Titre</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={title}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setTitle(data);
                        }}
                        config={{
                            toolbar: ['bold', 'italic', 'link']
                        }}
                        className="w-full border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Contenu</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={content}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setContent(data);
                        }}
                        config={{
                            toolbar: [
                                'heading', '|',
                                'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
                                'undo', 'redo'
                            ]
                        }}
                        className="w-full border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Équipe</label>
                    <select
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 bg-white"
                    >
                        <option value="">Sélectionnez une équipe</option>
                        {teams.map(team => (
                            <option key={team.id} value={team.id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2">
                <button 
            type="submit" 
            className="bg-green-500 text-white py-1 px-4  rounded hover:bg-green-600"
            >
            Ajouter
          </button>
                   
                </div>
            </form>
        </div>
    );
};

export default PresentationCreate;

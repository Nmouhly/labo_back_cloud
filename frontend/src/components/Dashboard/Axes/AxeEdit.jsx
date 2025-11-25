import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const AxeEdit = () => {
  const { id } = useParams(); // ID de l'axe à modifier
  const [axe, setAxe] = useState({
    title: '',
    content: '',
    team_id: '' // Ajout du champ team_id
  });
  const [teams, setTeams] = useState([]); // État pour les équipes
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  // Charger les informations de l'axe au chargement du composant
  useEffect(() => {
    const fetchAxe = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/axes/${id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        setAxe(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des informations de l\'axe', error);
        toast.error('Erreur lors du chargement des informations de l\'axe');
      }
    };
    fetchAxe();
  }, [id, accessToken]);

  // Charger la liste des équipes
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

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/api/axes/${id}`, axe, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        toast.success('Axe mis à jour avec succès');
        navigate('/dashboard/Axe'); // Rediriger vers la liste des axes après mise à jour
      } else {
        throw new Error('Réponse inattendue du serveur');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'axe', error.response || error);
      toast.error(`Erreur lors de la mise à jour de l\'axe: ${error.response?.data?.message || error.message}`);
    }
  };

  // Fonction pour gérer les changements dans le formulaire
  const handleTitleChange = (event, editor) => {
    const data = editor.getData();
    setAxe(prev => ({ ...prev, title: data }));
  };

  const handleContentChange = (event, editor) => {
    const data = editor.getData();
    setAxe(prev => ({ ...prev, content: data }));
  };

  const handleTeamChange = (e) => {
    setAxe(prev => ({ ...prev, team_id: e.target.value }));
  };

  // Fonction pour gérer le retour à la liste des axes
  const handleBack = () => {
    navigate('/dashboard/Axe');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Modifier l'Axe</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <CKEditor
            editor={ClassicEditor}
            data={axe.title}
            onChange={handleTitleChange}
            config={{
              toolbar: ['bold', 'italic', 'link']
            }}
            className="mb-4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contenu</label>
          <CKEditor
            editor={ClassicEditor}
            data={axe.content}
            onChange={handleContentChange}
            config={{
              toolbar: [
                'heading', '|',
                'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
                'undo', 'redo'
              ]
            }}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Équipe</label>
          <select
            value={axe.team_id}
            onChange={handleTeamChange}
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Mettre à jour
                </button>
       
      </form>
    </div>
  );
};

export default AxeEdit;

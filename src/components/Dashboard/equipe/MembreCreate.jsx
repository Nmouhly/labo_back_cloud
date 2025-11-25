import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const MembreCreate = () => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [customPosition, setCustomPosition] = useState('');
  const [bio, setBio] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [teamId, setTeamId] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [statut, setStatut] = useState('Membre');
  const [image, setImage] = useState(null); // Image handling
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

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
        console.error('Erreur lors de la récupération des équipes:', error);
        toast.error('Erreur lors de la récupération des équipes');
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        toast.error('Erreur lors de la récupération des utilisateurs');
      }
    };

    fetchTeams();
    fetchUsers();
  }, [accessToken]);

  const handleEmailChange = (e) => {
    const selectedEmail = e.target.value;
    setEmail(selectedEmail);

    const selectedUser = users.find(user => user.email === selectedEmail);
    if (selectedUser) {
      setName(selectedUser.name);
      setUserId(selectedUser.id);
    } else {
      setName('');
      setUserId('');
    }
  };

  const handlePositionChange = (e) => {
    const selectedPosition = e.target.value;
    setPosition(selectedPosition);
    if (selectedPosition !== 'Autre') {
      setCustomPosition('');
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Stocke l'image en base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError('Veuillez sélectionner un email valide.');
      toast.error('Veuillez sélectionner un email valide.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('position', position === 'Autre' ? customPosition : position);
    formData.append('bio', bio);
    formData.append('contact_info', contactInfo);
    formData.append('team_id', teamId);
    formData.append('user_id', userId);
    formData.append('email', email);
    formData.append('statut', statut);
    if (image) {
      formData.append('image', image); // Append image to form data
    }

    try {
      await axios.post('http://localhost:8000/api/members', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`
        },
      });

      toast.success('Membre ajouté avec succès');
      navigate('/dashboard/Member');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du membre:', error);
      setError('Erreur lors de l\'ajout du membre');
      toast.error('Erreur lors de l\'ajout du membre');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ajouter un Membre</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <select 
            value={email} 
            onChange={handleEmailChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Sélectionner un email</option>
            {users.map(user => (
              <option key={user.id} value={user.email}>
                {user.email}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Position</label>
          <select
            value={position}
            onChange={handlePositionChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Sélectionnez une position</option>
            <option value="Post Doctorant">Post Doctorant</option>
            <option value="Doctorant">Doctorant</option>
            <option value="Professeur des Universités">Professeur des Universités</option>
            <option value="Maître de Conférences">Maître de Conférences</option>
            <option value="Ingénieur de Recherche">Ingénieur de Recherche</option>
            <option value="Assistante de Gestion">Assistante de Gestion</option>
            <option value="ATER (Attaché Temporaire d'Enseignement et de Recherche)">
              ATER (Attaché Temporaire d'Enseignement et de Recherche)
            </option>
            <option value="Maître de Conférences avec HDR (Habilitation à Diriger des Recherches)">
              Maître de Conférences avec HDR (Habilitation à Diriger des Recherches)
            </option>
            <option value="Technicien">Technicien</option>
            <option value="Étudiant">Étudiant</option>
            <option value="Autre">Autre</option>
          </select>
          {position === 'Autre' && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Veuillez préciser la position</label>
              <input
                type="text"
                value={customPosition}
                onChange={(e) => setCustomPosition(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Entrez la position personnalisée"
              />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact</label>
          <input 
            type="text" 
            value={contactInfo} 
            onChange={(e) => setContactInfo(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Équipe</label>
          <select 
            value={teamId} 
            onChange={(e) => setTeamId(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Sélectionner une équipe</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Statut</label>
          <select
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Membre">Membre</option>
            <option value="Ancien">Ancien</option>
          </select>
        </div>
        <button 
          type="submit" 
          className="w-full p-2 bg-blue-600 text-white rounded"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default MembreCreate;

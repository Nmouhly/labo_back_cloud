import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserCreate = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [Etat, setEtat] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password length
    if (password.length < 8) {
      setError('Le mot de passe doit être supérieur à 8 caractères');
      toast.error('Le mot de passe doit être supérieur à 8 caractères');
      return; // Stop the form submission
    }

    try {
      const roleNumber = role === 'Admin' ? 1 : 0;

      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', roleNumber);
      formData.append('Etat', Etat);

      const response = await axios.post('http://localhost:8000/api/user/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      toast.success('Utilisateur ajouté avec succès');
      navigate('/dashboard/Utilisateur');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur', error.response?.data || error.message);
      setError('Erreur lors de l\'ajout de l\'utilisateur');
      toast.error('Erreur lors de l\'ajout de l\'utilisateur');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ajouter un Utilisateur</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mot de passe</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rôle</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Sélectionnez un rôle</option>
            <option value="Utilisateur">Utilisateur</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">État</label>
          <select 
            value={Etat} 
            onChange={(e) => setEtat(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Sélectionnez un état</option>
            <option value="approuve">Approuvé</option>
            <option value="non approuve">Non Approuvé</option>
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

export default UserCreate;

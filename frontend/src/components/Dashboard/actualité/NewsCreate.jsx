import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NewsCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Stocke l'image en base64
        console.log(reader.result); // Affiche le code d'image en base64
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Préparer les données à envoyer à votre API
      const newsData = {
        title,
        content,
        image // Image en base64
      };

      // Envoyer les données à votre API pour créer l'actualité
      const response = await axios.post('http://localhost:8000/api/news', newsData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('News added:', response.data);
      toast.success('Actualité ajoutée avec succès');
      navigate('/dashboard/NewsAdmin');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'actualité', error);
      setError('Erreur lors de l\'ajout de l\'actualité');
      toast.error('Erreur lors de l\'ajout de l\'actualité');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ajouter Actualité</h1>
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
          <label className="block text-sm font-medium mb-1">Contenu</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            placeholder="Entrez le contenu ici..."
            className="border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button type="submit" className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600">
          Ajouter
        </button>
      </form>

      <style jsx>{`
        .react-quill {
          height: 200px;
        }
      `}</style>
    </div>
  );
};

export default NewsCreate;

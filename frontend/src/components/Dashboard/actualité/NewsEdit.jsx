import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const NewsEdit = () => {
  const { id } = useParams();
  const [news, setNews] = useState({
    title: '',
    content: '',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié
    if (!accessToken) {
      toast.error('Veuillez vous connecter pour accéder à cette page');
      navigate('/login'); // Redirection vers la page de connexion
      return;
    }

    const fetchNews = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/news/${id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        setNews({
          title: response.data.title,
          content: response.data.content,
          image: ''
        });
        if (response.data.image) {
          setImagePreview(`http://localhost:8000/storage/${response.data.image}`);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des informations de la news', error);
        toast.error('Erreur lors du chargement des informations de la news');
      }
    };

    fetchNews();
  }, [id, accessToken, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNews({
          ...news,
          image: reader.result, // Encoded base64 image
        });
        setImagePreview(reader.result); // Display the image preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(`http://localhost:8000/api/news/${id}`, news, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      toast.success('News mise à jour avec succès');
      navigate('/dashboard/NewsAdmin');
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        setError('Erreur de validation : ' + Object.values(validationErrors).flat().join(', '));
      } else {
        setError('Erreur lors de la mise à jour de la news');
      }
      toast.error('Erreur lors de la mise à jour de la news');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNews({
      ...news,
      [name]: value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4" style={{ paddingBottom: '16px' }}>
      <h1 className="text-2xl font-bold mb-4">Modifier l'actualité</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input 
            type="text" 
            name="title" 
            value={news.title} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contenu</label>
          <textarea 
            name="content" 
            value={news.content} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border border-gray-300 rounded"
            rows="4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          {imagePreview && (
            <div className="mb-2">
              <img src={imagePreview} alt="Prévisualisation" className="w-full h-auto" />
            </div>
          )}
          <input 
            type="file" 
            onChange={handleImageChange} 
            accept="image/*" 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Mettre à jour
        </button>
      </form>
    </div>
  );
};

export default NewsEdit;

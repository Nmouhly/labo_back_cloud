import React, { useState } from 'react';
import axios from 'axios';

const Hi = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePath, setImagePath] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', 'nouhaila');
    formData.append('content','hhhhh');

    try {
      const response = await axios.post('http://localhost:8000/api/test/{id}', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log();
      setImagePath(response.data); // Supposons que le chemin de l'image est retourné dans la propriété 'path' de la réponse
    } catch (error) {
      console.error('Erreur lors de l\'envoi du fichier :', error);
      setError('Erreur lors de l\'envoi du fichier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imagePath && <img src={imagePath} alt="Uploaded" />}
    </>
  );
};

export default Hi;
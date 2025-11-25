import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const MessageDetail = () => {
  const { messageId } = useParams();
  const { accessToken } = useContext(AuthContext);
  const [message, setMessage] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/messages/${messageId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setMessage(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du message:', error);
      }
    };

    fetchMessage();
  }, [messageId, accessToken]);

  const handleReplyChange = (e) => {
    setReplyMessage(e.target.value);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8000/api/messages', {
        receiver_id: message.sender.id, // Inverser les ID
        message: replyMessage,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setReplyMessage(''); // Réinitialiser le champ de réponse
      alert('Message envoyé avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };

  if (!message) {
    return <div>Chargement...</div>;
  }

  // Définition des styles en ligne
  const styles = {
    container: {
      maxWidth: '600px',
      margin: '20px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      borderBottom: '1px solid #ccc',
      paddingBottom: '10px',
      marginBottom: '20px',
    },
    title: {
      fontSize: '24px',
      color: '#333',
      textAlign: 'center',
    },
    messageInfo: {
      marginBottom: '20px',
      fontSize: '14px',
      color: '#555',
    },
    strong: {
      color: '#333',
    },
    messageContent: {
      padding: '15px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      lineHeight: '1.5',
      color: '#333',
    },
    replyForm: {
      marginTop: '20px',
      display: 'flex',
      flexDirection: 'column',
    },
    replyInput: {
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      marginBottom: '10px',
    },
    replyButton: {
      padding: '10px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#28a745',
      color: '#fff',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Détails du Message</h2>
      </div>
      <div style={styles.messageInfo}>
        <p><strong style={styles.strong}>De :</strong> {message.sender.name} &lt;{message.sender.email}&gt;</p>
        <p>{new Date(message.created_at).toLocaleString()}</p>
        <p><strong style={styles.strong}>À :</strong> {message.receiver.name}</p>
      </div>
      <div style={styles.messageContent}>
        <p><strong style={styles.strong}>Message :</strong> {message.message}</p>
      </div>

      {/* Reply Form */}
      <form style={styles.replyForm} onSubmit={handleReplySubmit}>
        <textarea
          style={styles.replyInput}
          value={replyMessage}
          onChange={handleReplyChange}
          rows="4"
          placeholder="Écrire votre réponse..."
          required
        />
        <button type="submit" style={styles.replyButton}>Répondre</button>
      </form>
    </div>
  );
};

export default MessageDetail;

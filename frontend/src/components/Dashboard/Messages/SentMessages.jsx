import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Importer les composants de Toast
import 'react-toastify/dist/ReactToastify.css'; // Importer le CSS pour le toast
import './SentMessages.css';

const SentMessages = () => {
  const { accessToken, userId } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [receiverEmail, setReceiverEmail] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfileResponse = await axios.get('http://localhost:8000/api/user/profil', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserRole(userProfileResponse.data.user.role);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
    fetchMessages(); // Appeler fetchMessages ici pour charger les messages initialement
  }, [accessToken]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/messages/sent', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching sent messages:', error);
    }
  };

  const getFirstSixWords = (message) => {
    return message.split(' ').slice(0, 6).join(' ') + (message.split(' ').length > 6 ? '...' : '');
  };

  const handleSendMessage = async () => {
    try {
      const receiverResponse = await axios.post(
        'http://localhost:8000/api/get-user-id',
        { email: receiverEmail },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const receiverId = receiverResponse.data.user_id;
      if (!receiverId) {
        // Si l'email n'existe pas
        toast.error('Email introuvable !'); // Afficher un message d'erreur
        setReceiverEmail(''); // Vider l'input email
        return;
      }

      await axios.post(
        'http://localhost:8000/api/messages',
        {
          sender_id: userId,
          receiver_id: receiverId,
          message: messageContent,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Réinitialiser les champs et mettre à jour la liste des messages
      setReceiverEmail('');
      setMessageContent('');
      fetchMessages(); // Appeler fetchMessages pour mettre à jour les messages
      setIsModalOpen(false); // Fermer le modal après l'envoi
      toast.success('Message envoyé avec succès !'); // Afficher un message de succès

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Messages Envoyés</h1>

      <button className="btn btn-primary mb-3" onClick={() => setIsModalOpen(true)}>
        Nouveau Message
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="message-modal">
            <button className="close-modal" onClick={() => setIsModalOpen(false)}>
              &times;
            </button>
            <input
              type="email"
              placeholder="Email du destinataire"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              required
              className="form-control mb-2"
            />
            <textarea
              placeholder="Votre message"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              required
              className="form-control mb-2"
            />
            <button onClick={handleSendMessage} className="btn btn-success">
              Envoyer
            </button>
          </div>
        </div>
      )}

      <ul className="list-group">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((message) => (
            <li key={message.id} className="list-group-item">
              <Link 
                to={userRole === 1 ? `/dashboard/message/${message.id}` : `/user/message/${message.id}`} 
                className="message-link"
              >
                <div className="message-details">
                  <span className="message-recipient"><strong>À:</strong> {message.receiver.name}</span>
                  <span className="message-preview">{getFirstSixWords(message.message)}</span>
                  <span className="message-date">{new Date(message.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <li className="list-group-item">Aucun message trouvé.</li>
        )}
      </ul>

      {/* Container pour les notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
    </div>
  );
};

export default SentMessages;

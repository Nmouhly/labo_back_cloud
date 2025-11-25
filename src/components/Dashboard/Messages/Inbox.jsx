import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons'; // Import des icônes
import { ToastContainer, toast } from 'react-toastify'; // Importer les composants de Toast
import 'react-toastify/dist/ReactToastify.css'; // Importer le CSS pour le toast
import './SentMessages.css';

const Inbox = () => {
  const { accessToken, userId } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [receiverEmail, setReceiverEmail] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Utiliser le hook pour rediriger

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/messages/received', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setMessages(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages reçus :', error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfileResponse = await axios.get('http://localhost:8000/api/user/profil', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUserRole(userProfileResponse.data.user.role);
      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur :', error);
      }
    };

    fetchUserProfile();
    fetchMessages(); // Appeler fetchMessages ici
  }, [accessToken]);

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
        toast.error('Email introuvable !');
        setReceiverEmail('');
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

      setReceiverEmail('');
      setMessageContent('');
      fetchMessages();
      setIsModalOpen(false);
      toast.success('Message envoyé avec succès !');

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
    }
  };

  const getFirstSixWords = (message) => {
    return message.split(' ').slice(0, 6).join(' ') + (message.split(' ').length > 6 ? '...' : '');
  };

  const markAsReadOrNotRead = async (id, isRead) => {
    try {
      const url = isRead 
        ? `http://localhost:8000/api/messages/${id}/Notread` 
        : `http://localhost:8000/api/messages/${id}/read`;

      await axios.put(url, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setMessages(prevMessages =>
        prevMessages.map(message =>
          message.id === id ? { ...message, read: !isRead } : message
        )
      );
    } catch (error) {
      console.error(`Erreur lors du marquage du message comme ${isRead ? 'non lu' : 'lu'}:`, error);
    }
  };

  const handleClick = async (message) => {
    if (!message.read) {
      await markAsReadOrNotRead(message.id, false);
    }

    const path = userRole === 1 
      ? `/dashboard/message/${message.id}` 
      : `/user/message/${message.id}`;
    navigate(path);
  };

  return (
    <div className="container mt-5">
      <h1>Boîte de Réception</h1>
      
      <button className="btn btn-primary mb-3" onClick={() => setIsModalOpen(true)}>
        Nouveau Message
      </button>

      {isModalOpen && (
        <div className="modal fade show d-block" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Envoyer un Nouveau Message</h5>
                <button className="close" onClick={() => setIsModalOpen(false)}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="email"
                  placeholder="Email du destinataire"
                  value={receiverEmail}
                  onChange={(e) => setReceiverEmail(e.target.value)}
                  required
                  className="form-control mb-3"
                />
                <textarea
                  placeholder="Votre message"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  required
                  className="form-control"
                  rows="5"
                />
              </div>
              <div className="modal-footer">
                <button onClick={handleSendMessage} className="btn btn-primary">
                  Envoyer
                </button>
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ul className="list-group">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((message) => (
            <li 
              key={message.id} 
              className={`list-group-item d-flex justify-content-between align-items-center ${message.read ? 'read-message' : 'unread-message'}`}
              onClick={() => handleClick(message)}
              style={{ cursor: 'pointer' }}
            >
              <div className="message-details">
                <span className="font-weight-bold">
                  {message.sender.id === userId ? 'Moi' : message.sender.name}
                </span>
                <span className="message-preview">{getFirstSixWords(message.message)}</span>
                <span className="message-date">{new Date(message.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
              </div>
              <span onClick={(e) => {
                e.stopPropagation();
                markAsReadOrNotRead(message.id, message.read);
              }}>
                <FontAwesomeIcon 
                  icon={message.read ? faEnvelopeOpen : faEnvelope} 
                  className={`mail-icon ${message.read ? 'read-icon' : 'unread-icon'}`} 
                />
                <span className="ml-1">
                  {message.read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                </span>
              </span>
            </li>
          ))
        ) : (
          <li className="list-group-item text-center">Aucun message trouvé.</li>
        )}
      </ul>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
    </div>
  );
};

export default Inbox;

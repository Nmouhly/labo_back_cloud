// src/components/User/UserSidebar.jsx
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { BASE_URL, getConfig } from '../../helpers/config';
import { toast } from 'react-toastify';
import axios from 'axios';
import './UserSidebar.css';
import logo from '../../assets/labol2is.png';

const UserSidebar = () => {
  const { accessToken, setAccessToken, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMessagesSubmenuOpen, setIsMessagesSubmenuOpen] = useState(false); // Ajout de l'état pour Messages
  const [isPublicationsSubmenuOpen, setIsPublicationsSubmenuOpen] = useState(false);

 

  const togglePublicationsSubmenu = () => {
    setIsPublicationsSubmenuOpen(!isPublicationsSubmenuOpen);
    if (isMessagesSubmenuOpen) setIsMessagesSubmenuOpen(false); // Ferme le sous-menu Messages
  };

  const toggleMessagesSubmenu = () => {
    setIsMessagesSubmenuOpen(!isMessagesSubmenuOpen);
    if (isPublicationsSubmenuOpen) setIsPublicationsSubmenuOpen(false); // Ferme le sous-menu Publications
  };
  const logoutUser = async () => {
    try {
      await axios.post(`${BASE_URL}/user/logout`, null, getConfig(accessToken));
      localStorage.removeItem('currentToken');
      setAccessToken('');
      setCurrentUser(null);
      toast.success('Déconnexion réussie');
      navigate('/');
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.removeItem('currentToken');
        setAccessToken('');
        setCurrentUser(null);
        toast.error('Déconnexion échouée');
        navigate('/');
      }
      console.log(error);
    }
  };

  return (
    <div className="flex flex-1 pt-20">
      <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
        <div className="sidebar-logo">
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="Laboratory Logo" />
          </Link>
        </div>
        <div className="sb-sidenav-menu">
          <div className="nav">
            <Link className="nav-link" to="/user/UserProfile">
              <div className="sb-nav-link-icon"><i className="fas fa-project-diagram"></i></div>
              Dashboard
            </Link>
            <Link className="nav-link" to="/user/UserInfo">
              <div className="sb-nav-link-icon"><i className="fas fa-project-diagram"></i></div>
             Paramètres
            </Link>

            {/* Publications */}
            <div className="nav-link section-title" onClick={togglePublicationsSubmenu}>
              <div className="sb-nav-link-icon"><i className="fas fa-book"></i></div>
              Publications
            </div>
            <ul className={`submenu ${isPublicationsSubmenuOpen ? 'open' : ''}`}>
              <li><Link to="/user/UserOuvrage">Ouvrages</Link></li>
              <li><Link to="/user/UserRevues">Revues</Link></li>
              <li><Link to="/user/UserBrevet">Brevets</Link></li>
              <li><Link to="/user/UserRapport">Rapports </Link></li>
              <li><Link to="/user/UserThèse">Thèses et Doctorat</Link></li>
              <li><Link to="/user/UserHabilitation">Habilitation</Link></li>
            </ul>

            {/* Messages */}
            {/* <Link className="nav-link" to="/dashboard/MessagesAdmin">
              <div className="sb-nav-link-icon"><i className="fas fa-envelope"></i></div>
              Messages
            </Link> */}

            {/* <Link className="nav-link" to="/dashboard/ProjectsAdmin">
              <div className="sb-nav-link-icon"><i className="fas fa-project-diagram"></i></div>
              Projets Industriels
            </Link>
             */}
            {/* <Link className="nav-link" to="/dashboard/SeminarList">
              <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
              Evénements
            </Link> */}
             {/* Ajout du menu Messages */}
             <div className="nav-link section-title" onClick={toggleMessagesSubmenu}>
              <div className="sb-nav-link-icon"><i className="fas fa-envelope"></i></div>
              Messages
            </div>
            <ul className={`submenu ${isMessagesSubmenuOpen ? 'open' : ''}`}>
              <li><Link to="/user/messages/inbox">Inbox</Link></li>
              <li><Link to="/user/messages/sent">Messages Envoyés</Link></li>
            </ul>
            <button className="nav-link" onClick={logoutUser}>
              <div className="sb-nav-link-icon"><i className="fas fa-sign-out-alt"></i></div>
              Déconnexion
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default UserSidebar;

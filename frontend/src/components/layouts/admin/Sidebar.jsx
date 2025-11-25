import React, { useContext, useState ,useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { BASE_URL, getConfig } from '../../../helpers/config';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Sidebar.css';
import logo from '../../../assets/labol2is.png';

const Sidebar = () => {
  const { accessToken, setAccessToken, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEquipesSubmenuOpen, setIsEquipesSubmenuOpen] = useState(false);
  const [isPublicationsSubmenuOpen, setIsPublicationsSubmenuOpen] = useState(false);
  const [isMessagesSubmenuOpen, setIsMessagesSubmenuOpen] = useState(false); // Ajout de l'état pour Messages

  const [isPublicationsEnAttenteSubmenuOpen, setIsPublicationsEnAttenteSubmenuOpen] = useState(false);
  const [pendingCounts, setPendingCounts] = useState({
    habilitations: 0,
    theses: 0,
    reports: 0,
    brevets: 0,
    revues: 0,
    ouvrages: 0,
  });
  

  const fetchPendingCounts = async () => {
    try {
      const [habilitations, theses, reports, brevets, revues, ouvrages] = await Promise.all([
        axios.get(`${BASE_URL}/habilitationnAdmin`, getConfig(accessToken)),
        axios.get(`${BASE_URL}/thesesAdmin`, getConfig(accessToken)),
        axios.get(`${BASE_URL}/reports`, getConfig(accessToken)),
        axios.get(`${BASE_URL}/brevets`, getConfig(accessToken)),
        axios.get(`${BASE_URL}/revues`, getConfig(accessToken)),
        axios.get(`${BASE_URL}/ouvrages`, getConfig(accessToken)),
      ]);
  
      setPendingCounts({
        habilitations: habilitations.data.length || 0,
        theses: theses.data.length || 0,
        reports: reports.data.length || 0,
        brevets: brevets.data.length || 0,
        revues: revues.data.length || 0,
        ouvrages: ouvrages.data.length || 0,
      });
    } catch (error) {
      console.error('Error fetching pending counts:', error);
    }
  };
  
  const toggleEquipesSubmenu = () => {
    setIsEquipesSubmenuOpen(!isEquipesSubmenuOpen);
    if (isPublicationsSubmenuOpen) setIsPublicationsSubmenuOpen(false);
    if (isMessagesSubmenuOpen) setIsMessagesSubmenuOpen(false); // Ferme le sous-menu Messages
    if (isPublicationsEnAttenteSubmenuOpen) setIsPublicationsEnAttenteSubmenuOpen(false);
  };

  const togglePublicationsSubmenu = () => {
    setIsPublicationsSubmenuOpen(!isPublicationsSubmenuOpen);
    if (isEquipesSubmenuOpen) setIsEquipesSubmenuOpen(false);
    if (isMessagesSubmenuOpen) setIsMessagesSubmenuOpen(false); // Ferme le sous-menu Messages
  };

  const toggleMessagesSubmenu = () => {
    setIsMessagesSubmenuOpen(!isMessagesSubmenuOpen);
    if (isEquipesSubmenuOpen) setIsEquipesSubmenuOpen(false);
    if (isPublicationsSubmenuOpen) setIsPublicationsSubmenuOpen(false); // Ferme le sous-menu Publications
    if (isPublicationsEnAttenteSubmenuOpen) setIsPublicationsEnAttenteSubmenuOpen(false);
  };

  const togglePublicationsEnAttenteSubmenu = () => {
    setIsPublicationsEnAttenteSubmenuOpen(!isPublicationsEnAttenteSubmenuOpen);
    if (isEquipesSubmenuOpen) setIsEquipesSubmenuOpen(false);
    if (isPublicationsSubmenuOpen) setIsPublicationsSubmenuOpen(false);
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
  useEffect(() => {
    fetchPendingCounts();
  }, [accessToken]);
  
  useEffect(() => {
    console.log("Pending Counts:", pendingCounts);
  }, [pendingCounts]);
  
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
            <Link className="nav-link" to="/dashboard/SidebarConfig">
              <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
              Sidebar
            </Link>
            <Link className="nav-link" to="/dashboard/AdminHomeDescription">
              <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
              Home
            </Link>
            <Link className="nav-link" to="/dashboard/Utilisateur">
              <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
              Utilisateurs
            </Link>
            <Link className="nav-link" to="/dashboard/NewsAdmin">
              <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
              Actualités
            </Link>
            <Link className="nav-link" to="/dashboard/Member">
              <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
              Members
            </Link>

            {/* Équipes */}
            <div className="nav-link section-title" onClick={toggleEquipesSubmenu}>
              <div className="sb-nav-link-icon"><i className="fas fa-user-friends"></i></div>
              Équipes
            </div>
            <ul className={`submenu ${isEquipesSubmenuOpen ? 'open' : ''}`}>
              <li><Link to="/dashboard/equipe">Équipe</Link></li>
              <li><Link to="/dashboard/PresentationAdmin">Présentation</Link></li>
              <li><Link to="/dashboard/axe">Axes de Recherche</Link></li>
            </ul>

            {/* Publications */}
            <div className="nav-link section-title" onClick={togglePublicationsSubmenu}>
              <div className="sb-nav-link-icon"><i className="fas fa-book"></i></div>
              Publications
            </div>
            <ul className={`submenu ${isPublicationsSubmenuOpen ? 'open' : ''}`}>
              <li><Link to="/dashboard/ouvrage">Ouvrages</Link></li>
              <li><Link to="/dashboard/revues">Revues</Link></li>
              <li><Link to="/dashboard/report">Rapports</Link></li>
              <li><Link to="/dashboard/patent">Brevets</Link></li>
              <li><Link to="/dashboard/theses">Thèses et Doctorat</Link></li>
              <li><Link to="/dashboard/habilitation">Habilitation</Link></li>
              <li><Link to="/dashboard/conference">Conférences</Link></li>

            </ul>
            

          
             {/* Publications en attente */}
             {/* Publications en attente */}
             <div className="nav-link section-title" onClick={togglePublicationsEnAttenteSubmenu}>
              <div className="sb-nav-link-icon"><i className="fas fa-book"></i></div>
              Publications en attente
              {Object.values(pendingCounts).some(count => count > 0) && (
                <span className="notification-icon">🔔</span> 
              )}
            </div>
            <ul className={`submenu ${isPublicationsEnAttenteSubmenuOpen ? 'open' : ''}`}>
              <li>
                <Link to="/dashboard/ouvrageenattente">
                  Ouvrages En Attente
                  {pendingCounts.ouvrages > 0 && (
                    <span className="notification-count">{pendingCounts.ouvrages}</span>
                  )}
                </Link>
              </li>
              <li>
                <Link to="/dashboard/revuesenattente">
                  Revues En Attente
                  {pendingCounts.revues > 0 && (
                    <span className="notification-count">{pendingCounts.revues}</span>
                  )}
                </Link>
              </li>
              <li>
                <Link to="/dashboard/reportenattente">
                  Rapports En Attente
                  {pendingCounts.reports > 0 && (
                    <span className="notification-count">{pendingCounts.reports}</span>
                  )}
                </Link>
              </li>
              <li>
                <Link to="/dashboard/patentenattente">
                  Brevets En Attente
                  {pendingCounts.brevets > 0 && (
                    <span className="notification-count">{pendingCounts.brevets}</span>
                  )}
                </Link>
              </li>
              <li>
                <Link to="/dashboard/thesesenattente">
                  Thèses En Attente
                  {pendingCounts.theses > 0 && (
                    <span className="notification-count">{pendingCounts.theses}</span>
                  )}
                </Link>
              </li>
              <li>
                <Link to="/dashboard/habilitationenattente">
                  Habilitations En Attente
                  {pendingCounts.habilitations > 0 && (
                    <span className="notification-count">{pendingCounts.habilitations}</span>
                  )}
                </Link>
              </li>
            </ul>

            <Link className="nav-link" to="/dashboard/JobOffer">
              <div className="sb-nav-link-icon"><i className="fas fa-project-diagram"></i></div>
              Offres d'emploi
            </Link>
            <Link className="nav-link" to="/dashboard/ProjectsAdmin">
              <div className="sb-nav-link-icon"><i className="fas fa-project-diagram"></i></div>
              Projets Industriels
            </Link>
            <Link className="nav-link" to="/dashboard/SeminarList">
              <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
              Séminaires
            </Link>
            {/* Ajout du menu Messages */}
            <div className="nav-link section-title" onClick={toggleMessagesSubmenu}>
              <div className="sb-nav-link-icon"><i className="fas fa-envelope"></i></div>
              Messages
            </div>
            <ul className={`submenu ${isMessagesSubmenuOpen ? 'open' : ''}`}>
              <li><Link to="/dashboard/messages/inbox">Inbox</Link></li>
              <li><Link to="/dashboard/messages/sent">Messages Envoyés</Link></li>
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

export default Sidebar;

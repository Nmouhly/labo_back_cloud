import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import '../../../assets/admin/css/styles.css'; // Assurez-vous que ce chemin est correct
import '../../../assets/admin/js/scripts.js'; // Assurez-vous que ce chemin est correct
import Statistics from '../../../../src/pages/Statistics.jsx';
import Navbar from './Navbar'; // Import the Navbar component
import UserProfile from '../../../components/User/UserProfile';

const MasterLayout = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const layoutSidenavContentStyle = {

    paddingLeft: isSidebarVisible ? '300px' : '0',
    transition: 'padding-left 0.3s',

    // paddingLeft: isSidebarVisible ? '40px' : '0',
    // transition: 'padding-left 0s',
    // marginTop: '-850px',  // Ajoutez ceci pour supprimer l'espace extérieur en haut



  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="sb-nav-fixed">
        <div id="layoutSidenav" style={{ position: 'relative', display: 'flex' }}>
          {isSidebarVisible && (
            <div id="layoutSidenav_nav">
              <Sidebar />
            </div>
          )}
          
          <div id="layoutSidenav_con" style={{ ...layoutSidenavContentStyle, display: 'flex', width: '100%' }}>
          <main >
             

              <Outlet /> {/* Affiche les routes enfants */}
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default MasterLayout;

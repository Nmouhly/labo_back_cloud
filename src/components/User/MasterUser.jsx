import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/authContext'; // Import context
import UserLayout from './UserLayout';
import './MasterUser.css'; // Importez le fichier CSS
import UserSidebar from './UserSidebar';

const MasterUser = () => {
  const { currentUser } = useContext(AuthContext); // Get currentUser from context

  return (
    <div className="sb-nav-fixed">
    <UserLayout  /> {/* Pass userName */}
    <div id="layoutSidenav">
      <div id="layoutSidenav_nav">
        <UserSidebar />
      </div>
      <div id="layoutSidenav_content">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  </div>
  );
};

export default MasterUser;
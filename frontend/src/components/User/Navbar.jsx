import React from 'react';
import './Navbar.css'; // Ensure CSS file for navbar styles
import fullscreenIcon from '../../assets/fullscreen.png'; // Icon for toggling the sidebar

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">Laboratoire d'ingénierie informatique / L2IS</h1>
        <button
          onClick={toggleSidebar} // Callback for toggling sidebar visibility
          className="toggle-sidebar-btn"
          aria-label="Toggle Sidebar"
        >
          <img
            src={fullscreenIcon}
            alt="Toggle Sidebar"
            className="toggle-sidebar-icon"
          />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
import React from 'react';
import './Navbar.css'; // Ensure you have a CSS file for the navbar styles
import fullscreenIcon from '../../../assets/fullscreen.png'; // Import the image

const Navbar = ({ toggleSidebar }) => {
  return (
    <div className="flex flex-col h-screen">
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex items-center justify-between z-10">
      <div className="navbar-container">
        <h1 className="navbar-title">Université Cadi Ayyad / FSTG</h1>
        <button
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px', // Adjust position to be on the right side
            zIndex: 9999,
            background: 'none',
            border: 'none'
          }}
        >
          <img
            src={fullscreenIcon}
            alt="Toggle Sidebar"
            style={{ width: '30px', height: '30px' }}
          />
        </button>
      </div>
    </header>
    </div>
  );
};

export default Navbar;

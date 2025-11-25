// components/layouts/VisitorLayout.js
import { Outlet } from 'react-router-dom';
import VisitorSidebar from './VisitorSidebar';
import fullscreen from '../../../assets/fullscreen.png';
import { useState } from 'react';

const VisitorLayout = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex items-center justify-between z-10">
        <h1 className="text-xl font-bold"> Laboratoire d'Ingénierie
        Informatique et Systèmes / L2IS</h1>
        <img
          src={fullscreen}
          alt="Toggle Sidebar"
          className="cursor-pointer"
          onClick={toggleSidebar}
          style={{ width: '24px', height: '24px' }}
        />
      </header>
      <div className="flex flex-1 pt-16"> {/* Add padding-top to avoid header overlap */}
        {isSidebarVisible && <VisitorSidebar />}
        <div className={`flex-1 transition-all duration-300 ${isSidebarVisible ? 'ml-64' : 'ml-0'} pt-4`}> {/* Add padding-top */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default VisitorLayout;
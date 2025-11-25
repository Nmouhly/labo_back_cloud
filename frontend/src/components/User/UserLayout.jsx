// components/layouts/VisitorLayout.js
import { Outlet } from 'react-router-dom';
import fullscreen from '../../assets/fullscreen.png';
import { useState } from 'react';

const VisitorLayout = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex items-center justify-between z-10">
        <h1 className="text-xl font-bold">Laboratoire d'Ingénierie Informatique et Systèmes / L2IS</h1>
      
      </header>
      
    </div>
  );
};

export default VisitorLayout;
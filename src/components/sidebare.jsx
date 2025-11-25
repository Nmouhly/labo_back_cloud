// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import logo from '../assets/logo.png';

// const Sidebar = ({ currentUser, logoutUser }) => {
//   const location = useLocation();

//   const navigation = [
//     { name: 'Accueil', href: '/' },
//     { name: 'Organisation', href: '/organisation' },
//     { name: 'Équipes', href: '/equipes' },
//     { name: 'Personnel', href: '/personnel' },
//     { name: 'Publications', href: '/publications' },
//     { name: 'Projets', href: '/projets' },
//     { name: 'Informations', href: '/informations' },
//     { name: 'Événements', href: '/evenements' },
//   ];

//   return (
//     <nav className="bg-gray-800 text-white w-64 h-full fixed top-0 left-0 flex flex-col items-center py-4">
//       <Link to="/" className="flex items-center mb-6">
//         <img src={logo} alt="Logo" className="h-8 mr-2" />
//       </Link>
//       <div className="flex flex-col space-y-4 w-full">
//         {navigation.map((item) => (
//           <Link
//             key={item.name}
//             to={item.href}
//             className={`px-3 py-2 rounded-md text-sm font-medium w-full text-center ${
//               location.pathname === item.href
//                 ? 'bg-gray-900 text-white'
//                 : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//             }`}
//           >
//             {item.name}
//           </Link>
//         ))}
//       </div>
//       {currentUser && (
//         <div className="mt-6 flex flex-col items-center w-full">
//           <span className="text-gray-300 mb-4">Bienvenue, {currentUser.name}</span>
//           <button
//             className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white w-full"
//             onClick={logoutUser}
//           >
//             Déconnexion
//           </button>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Sidebar;

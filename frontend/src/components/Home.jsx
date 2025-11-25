import React, { useState, useEffect } from 'react';
import logo from '../assets/labol2is.png';
import arrowGif from '../assets/fleche.gif';
import HomeNews from './HomeNews';
import parse from 'html-react-parser';
import JobOffersList from '../pages/JobOffersList';
import axios from 'axios';
// import Statistics from '../pages/Statistics';

const Home = ({ currentUser, logoutUser, isSidebarVisible, toggleSidebar }) => {
    const [descriptions, setDescriptions] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDescription = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/home-descriptions');
                setDescriptions(response.data.content);
            } catch (err) {
                setError('Erreur lors de la récupération des descriptions.');
            }
        };

        fetchDescription();
    }, []);

    return (
        <div className="p-6 flex flex-col items-center min-h-screen">
            {/* Section Logo */}
            <div className="flex items-center mb-6">
                <img
                    src={logo}
                    alt="Laboratory Logo"
                    className="h-36"
                />
            </div>

            {/* Title */}
            <h1 className="text-4xl mt-6 mb-4 text-center text-indigo-900 font-extrabold tracking-tight">
                L2IS - Laboratoire d'Ingénierie Informatique et Systèmes
            </h1>

            {error && (
                <p className="text-red-700 bg-red-100 border-l-4 border-red-700 rounded-r-lg p-4 mb-4 font-medium relative">
                    {error}
                    <span className="absolute top-1/2 right-4 transform -translate-y-1/2 text-red-700 opacity-50 animate-ping">!</span>
                </p>
            )}

            {/* Descriptions with Gradient Background */}
           {/* Descriptions with Gradient Background */}
{descriptions && (
    <div className="mb-6 text-center w-full"> {/* Remove max-w for full width */}
        <div className="bg-gradient-to-r from-sky-200 to-white p-6 rounded-lg shadow-lg h-auto w-full">
            <p className="text-indigo-800 text-lg">{parse(descriptions)}</p> {/* Adjust text size for better readability */}
        </div>
    </div>
)}


            {/* Animated Arrow */}
            <div className="flex flex-col items-center mb-6">
                <h2 className="text-indigo-800 text-3xl mt-8 font-semibold">Actualités</h2>
                <img
                    src={arrowGif}
                    alt="Flèche animée"
                    className="h-16"
                />
            </div>

            {/* List of News */}
            <HomeNews />
            <JobOffersList />
            {/* <Statistics /> */}
        </div>
    );
};

export default Home;

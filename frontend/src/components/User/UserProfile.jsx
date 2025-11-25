import React, { useContext } from 'react';
import { AuthContext } from '../../context/authContext'; // Assurez-vous que le chemin est correct
import './UserProfile.css'; // Import the CSS file for styling and animation

function UserProfile() {
    const { currentUser } = useContext(AuthContext);
    
    // Function to determine the greeting based on the time of day
    const getGreeting = () => {
        const hours = new Date().getHours();
        if (hours < 12) return 'Hello';
        if (hours < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="user-profile">
            <h1 className="greeting">{currentUser ? `${getGreeting()} ${currentUser.name}` : 'Loading...'}</h1>
            {currentUser ? (
                <div>
                    
                    {/* Ajoutez ici d'autres informations que vous souhaitez afficher */}
                </div>
            ) : (
                <p>Loading user information...</p>
            )}
        </div>
    );
}

export default UserProfile;

import React, { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import '../../../src/components/User/UserProfile.css';
import Statistics from '../../pages/Statistics'; // Adjust the path as needed

function AdminProfile() {
    const { currentUser } = useContext(AuthContext);
   
    const getGreeting = () => {
        const hours = new Date().getHours();
        if (hours < 12) return 'Good morning';
        if (hours < 18) return 'Good afternoon';
        return 'Good evening';
    };

    if (!currentUser) {
        return <p>Loading user information...</p>;
    }

    return (
        <div className="admin-profile">
            <h1 className="greetingAdmin">{`${getGreeting()} ${currentUser.name}`}</h1>
           <div className='hi'><Statistics /></div>
            
        </div>
    );
}

export default AdminProfile;
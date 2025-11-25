import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './context/authContext';

export default function UserPrivateRoute({ children }) {
    const { currentUser } = useContext(AuthContext);

    if (!currentUser || currentUser.role !== 0) { // Vérification si l'utilisateur est authentifié et a le rôle utilisateur
        return <Navigate to="/login" />;
    }

    return children;
}
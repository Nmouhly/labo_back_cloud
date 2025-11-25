import { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/authContext';
import axios from 'axios';
import { BASE_URL } from './helpers/config';

const AdminPrivateRoute = ({ children }) => {
    const { accessToken, currentUser } = useContext(AuthContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/checkingAuthenticated`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                if (response.data.authenticated && currentUser?.role === 1) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        if (accessToken) {
            checkAuth();
        } else {
            setIsAuthenticated(false);
            setIsLoading(false);
        }
    }, [accessToken, currentUser]);

    if (isLoading) {
        return <>Loading...</>;
    }

    return isAuthenticated ? (
        children
    ) : (
        <Navigate to="/login" state={{ from: location }} />
    );
};

export default AdminPrivateRoute;

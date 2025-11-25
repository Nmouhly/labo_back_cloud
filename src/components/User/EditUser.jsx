import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext'; // Import AuthContext
import axios from 'axios';

const EditUser = () => {
    const { currentUser, accessToken } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        position: '',
        team_id: '',
        bio: '',
        contact_info: '',
        image: '',
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [memberId, setMemberId] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/members/user/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setUserData(response.data);
                setMemberId(response.data.id);
                if (response.data.image) {
                    setImagePreview(`http://localhost:8000/storage/${response.data.image}`);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id, accessToken]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData((prevState) => ({
                    ...prevState,
                    image: reader.result,
                }));
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            // Si aucun fichier n'est sélectionné, conserver l'ancienne image
            setImagePreview(userData.image ? `http://localhost:8000/storage/${userData.image}` : null);
        }
    };

    const handleSaveClick = async () => {
        try {
            const userUpdateData = {
                name: userData.name,
                email: userData.email,
            };
            
            if (userData.password) {
                userUpdateData.password = userData.password;
            }

            await axios.put(`http://localhost:8000/api/user/${currentUser.id}`, userUpdateData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            if (memberId) {
                await axios.put(`http://localhost:8000/api/member/${memberId}`, {
                    position: userData.position,
                    bio: userData.bio,
                    contact_info: userData.contact_info,
                    user_id: currentUser.id,
                    image: userData.image || userData.previousImage, // Utiliser l'ancienne image si aucune nouvelle image n'est fournie
                }, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                });
            }

            alert('User information updated successfully.');
            navigate('/user/UserInfo');

        } catch (error) {
            console.error('Error updating user data:', error);
            alert('An error occurred while updating user information.');
        }
    };

    // Fonction pour basculer la visibilité du mot de passe
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div style={styles.container}>
            {loading ? (
                <p style={styles.loadingText}>Loading user information...</p>
            ) : (
                <div style={styles.userInfo}>
                    <h2>Modifier les informations</h2>
                    <div style={styles.userDetailContainer}>
                        <strong style={styles.label}>Nom</strong>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.userDetailContainer}>
                        <strong style={styles.label}>Email</strong>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                    </div>

                    {/* Champ Password avec une icône œil */}
                    <div style={styles.userDetailContainer}>
                        <strong style={styles.label}>Mot de passe</strong>
                        <div style={styles.passwordContainer}>
                            <input
                                type={passwordVisible ? "text" : "password"}
                                name="password"
                                value={userData.password || ''}
                                onChange={handleInputChange}
                                style={styles.input}
                                placeholder="Enter new password"
                            />
                            <span onClick={togglePasswordVisibility} style={styles.eyeIcon}>
                                {passwordVisible ? '👁️' : '👁️‍🗨️'}
                            </span>
                        </div>
                    </div>

                    <div style={styles.userDetailContainer}>
                        <strong style={styles.label}>Position</strong>
                        <input
                            type="text"
                            name="position"
                            value={userData.position}
                            onChange={handleInputChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.userDetailContainer}>
                        <strong style={styles.label}>Biographie</strong>
                        <textarea
                            name="bio"
                            value={userData.bio}
                            onChange={handleInputChange}
                            style={styles.textarea}
                        />
                    </div>
                    <div style={styles.userDetailContainer}>
                        <strong style={styles.label}>Contact</strong>
                        <input
                            type="text"
                            name="contact_info"
                            value={userData.contact_info}
                            onChange={handleInputChange}
                            style={styles.input}
                            placeholder="Téléphone : +212 6 12 34 56 73"
                        />
                        {userData.contact_info && !/^\+?\d{1,3}?[-. ]?\(?\d{1,4}?\)?[-. ]?\d{1,4}[-. ]?\d{1,9}$/.test(userData.contact_info) && (
                            <span style={styles.errorMessage}>Numéro de téléphone invalide</span>
                        )}
                    </div>
                    <div style={styles.userDetailContainer}>
                        <strong style={styles.label}>Profile Image</strong>
                        {imagePreview && (
                            <div style={styles.imagePreviewContainer}>
                                <img src={imagePreview} alt="Profile Preview" style={styles.imagePreview} />
                            </div>
                        )}
                        <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            style={styles.input}
                        />
                    </div>
                    <button onClick={handleSaveClick} style={styles.saveButton}>
                        Enregistré
                    </button>
                </div>
            )}
        </div>
    );
};

// Styles
const styles = {
    container: {
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
        margin: 'auto',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
    },
    userInfo: {
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    userDetailContainer: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid #eee',
    },
    label: {
        flex: '1',
        textAlign: 'right',
        marginRight: '12px',
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        flex: '3',
        padding: '8px',
        fontSize: '16px',
        color: '#555',
        border: '1px solid #ccc',
        borderRadius: '4px',
        margin: 0,
    },
    textarea: {
        flex: '3',
        padding: '8px',
        fontSize: '16px',
        color: '#555',
        border: '1px solid #ccc',
        borderRadius: '4px',
        margin: 0,
        height: '80px',
    },
    passwordContainer: {
        flex: '3',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
    },
    eyeIcon: {
        cursor: 'pointer',
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '18px',
        color: '#999',
    },
    imagePreviewContainer: {
        marginBottom: '10px',
    },
    imagePreview: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    saveButton: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    loadingText: {
        fontSize: '18px',
        color: '#555',
    },
    errorMessage: {
        color: 'red',
        marginTop: '5px',
    },
};

export default EditUser;

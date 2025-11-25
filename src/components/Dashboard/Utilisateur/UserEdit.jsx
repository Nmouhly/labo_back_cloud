import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';

const UserEdit = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(0); // 0 for user, 1 for admin
    const [etat, setEtat] = useState(''); // Nouvel état pour l'état de l'utilisateur
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/users/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const user = response.data;
                setName(user.name);
                setEmail(user.email);
                setRole(user.role);
                setEtat(user.Etat); // Assurez-vous que le backend renvoie 'Etat'
            } catch (error) {
                console.error('Erreur lors de la récupération de l’utilisateur', error.response || error.message);
                setError('Erreur lors de la récupération de l’utilisateur. Veuillez réessayer.');
                toast.error('Erreur lors de la récupération de l’utilisateur.');
            }
        };

        fetchUser();
    }, [id, accessToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedUser = {
            name,
            email,
            password: password ? password : undefined, // Only include password if it's not empty
            role,
            Etat: etat, // Inclure le champ Etat
        };

        try {
            const response = await axios.put(`http://localhost:8000/api/users/${id}`, updatedUser, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            console.log('Utilisateur modifié:', response.data);
            toast.success('Utilisateur modifié avec succès');
            navigate('/dashboard/Utilisateur');
        } catch (error) {
            console.error('Erreur lors de la modification de l’utilisateur', error.response || error.message);
            setError('Erreur lors de la modification de l’utilisateur. Veuillez réessayer.');
            toast.error('Erreur lors de la modification de l’utilisateur.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Modifier l'Utilisateur</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Nom</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Mot de passe</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Laisser vide pour ne pas modifier"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Rôle</label>
                    <select 
                        value={role} 
                        onChange={(e) => setRole(parseInt(e.target.value, 10))} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value={0}>Utilisateur</option>
                        <option value={1}>Admin</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">État</label>
                    <select 
                        value={etat} 
                        onChange={(e) => setEtat(e.target.value)} 
                        required 
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="approuve">Approuvé</option>
                        <option value="non approuve">Non Approuvé</option>
                    </select>
                </div>
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Modifier
                </button>
            </form>
        </div>
    );
};

export default UserEdit;

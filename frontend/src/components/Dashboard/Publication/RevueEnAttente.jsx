import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { BASE_URL, getConfig } from '../../../helpers/config';
import { toast } from 'react-toastify';

const RevueEnAttente = () => {
    const { accessToken, currentUser } = useContext(AuthContext);
    const [revues, setRevues] = useState([]);
    const [selectedRevues, setSelectedRevues] = useState([]);

    useEffect(() => {
        const fetchRevues = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/revues`, getConfig(accessToken));
                const filteredRevues = response.data.filter(
                    (revue) => revue.status === 'en attente' && revue.id_user !== currentUser.id
                );
                setRevues(filteredRevues);
            } catch (error) {
                console.error('Erreur lors de la récupération des revues en attente:', error);
            }
        };
        fetchRevues();
    }, [accessToken, currentUser]);

    const handleSelectAll = () => {
        if (selectedRevues.length === revues.length) {
            setSelectedRevues([]); // Désélectionner tout
        } else {
            setSelectedRevues(revues.map((revue) => revue.id)); // Sélectionner tout
        }
    };

    const handleSelectRevue = (id) => {
        setSelectedRevues((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((revueId) => revueId !== id) // Désélectionner
                : [...prevSelected, id] // Sélectionner
        );
    };

    const handleAccept = async (id) => {
        try {
            await axios.post(`${BASE_URL}/revues/accept/${id}`, {}, getConfig(accessToken));
            toast.success('Revue acceptée avec succès!');
            setRevues(revues.filter((revue) => revue.id !== id)); // Supprime la revue de la liste
            setSelectedRevues(selectedRevues.filter((revueId) => revueId !== id)); // Supprime de la sélection
        } catch (error) {
            console.error('Erreur lors de l\'acceptation de la revue:', error);
            toast.error('Erreur lors de l\'acceptation de la revue');
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.post(`${BASE_URL}/revues/reject/${id}`, {}, getConfig(accessToken));
            toast.success('Revue rejetée avec succès!');
            setRevues(revues.filter((revue) => revue.id !== id)); // Supprime la revue de la liste
            setSelectedRevues(selectedRevues.filter((revueId) => revueId !== id)); // Supprime de la sélection
        } catch (error) {
            console.error('Erreur lors du rejet de la revue:', error);
            toast.error('Erreur lors du rejet de la revue');
        }
    };

    const handleAcceptSelected = async () => {
        try {
            await Promise.all(
                selectedRevues.map((id) =>
                    axios.post(`${BASE_URL}/revues/accept/${id}`, {}, getConfig(accessToken))
                )
            );
            toast.success('Revues sélectionnées acceptées avec succès!');
            setRevues(revues.filter((revue) => !selectedRevues.includes(revue.id)));
            setSelectedRevues([]);
        } catch (error) {
            console.error('Erreur lors de l\'acceptation des revues sélectionnées:', error);
            toast.error('Erreur lors de l\'acceptation des revues sélectionnées');
        }
    };

    const handleRejectSelected = async () => {
        try {
            await Promise.all(
                selectedRevues.map((id) =>
                    axios.post(`${BASE_URL}/revues/reject/${id}`, {}, getConfig(accessToken))
                )
            );
            toast.success('Revues sélectionnées rejetées avec succès!');
            setRevues(revues.filter((revue) => !selectedRevues.includes(revue.id)));
            setSelectedRevues([]);
        } catch (error) {
            console.error('Erreur lors du rejet des revues sélectionnées:', error);
            toast.error('Erreur lors du rejet des revues sélectionnées');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="publications-en-attente w-full max-w-3xl p-4 bg-white shadow-lg rounded-lg text-left">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-left">Revues en Attente</h2>
                <div className="mb-4">
                    <button
                        onClick={handleAcceptSelected}
                        disabled={!selectedRevues.length}
                        className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600 transition"
                    >
                        Accepter les sélectionnées
                    </button>
                    <button
                        onClick={handleRejectSelected}
                        disabled={!selectedRevues.length}
                        className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                    >
                        Rejeter les sélectionnées
                    </button>
                </div>
                <table className="min-w-full border border-gray-300 bg-white divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">
                                <input
                                    type="checkbox"
                                    checked={selectedRevues.length === revues.length && revues.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="px-6 py-3 text-left">Titre</th>
                            <th className="px-6 py-3 text-left">Auteur</th>
                            <th className="px-6 py-3 text-left">DOI</th>
                            <th className="px-6 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-50">
                        {revues.length > 0 ? (
                            revues.map((revue) => (
                                <tr key={revue.id} className="border-b">
                                    <td className="px-4 py-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedRevues.includes(revue.id)}
                                            onChange={() => handleSelectRevue(revue.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-3">{revue.title}</td>
                                    <td className="px-6 py-3">{revue.author}</td>
                                    <td className="px-6 py-3">
                                        <a
                                            href={`https://doi.org/${revue.DOI}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {revue.DOI}
                                        </a>
                                    </td>
                                    <td className="px-6 py-3">
                                        <button
                                            onClick={() => handleAccept(revue.id)}
                                            className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600 transition"
                                        >
                                            Accepter
                                        </button>
                                        <button
                                            onClick={() => handleReject(revue.id)}
                                            className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                                        >
                                            Rejeter
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4">Aucune revue en attente.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RevueEnAttente;

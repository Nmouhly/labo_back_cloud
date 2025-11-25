import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { BASE_URL, getConfig } from '../../../helpers/config';
import { toast } from 'react-toastify';

const HabilitationEnAttente = () => {
    const { accessToken, currentUser } = useContext(AuthContext);
    const [habilitations, setHabilitations] = useState([]);
    const [selectedHabilitations, setSelectedHabilitations] = useState([]);

    useEffect(() => {
        const fetchHabilitations = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/habilitations`, getConfig(accessToken));
                const filteredHabilitations = response.data.filter(
                    (habilitation) => habilitation.status === 'en attente' && habilitation.id_user !== currentUser.id
                );
                setHabilitations(filteredHabilitations);
            } catch (error) {
                console.error('Erreur lors de la récupération des habilitations en attente:', error);
            }
        };
        fetchHabilitations();
    }, [accessToken, currentUser]);

    const handleSelectAll = () => {
        if (selectedHabilitations.length === habilitations.length) {
            setSelectedHabilitations([]); // Désélectionner tout
        } else {
            setSelectedHabilitations(habilitations.map((habilitation) => habilitation.id)); // Sélectionner tout
        }
    };

    const handleSelectHabilitation = (id) => {
        setSelectedHabilitations((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((habilitationId) => habilitationId !== id) // Désélectionner
                : [...prevSelected, id] // Sélectionner
        );
    };

    const handleAccept = async (id) => {
        try {
            await axios.post(`${BASE_URL}/habilitations/accept/${id}`, {}, getConfig(accessToken));
            toast.success('Habilitation acceptée avec succès!');
            setHabilitations(habilitations.filter((habilitation) => habilitation.id !== id)); // Supprime l'habilitation de la liste
            setSelectedHabilitations(selectedHabilitations.filter((habilitationId) => habilitationId !== id)); // Supprime de la sélection
        } catch (error) {
            console.error('Erreur lors de l\'acceptation de l\'habilitation:', error);
            toast.error('Erreur lors de l\'acceptation de l\'habilitation');
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.post(`${BASE_URL}/habilitations/reject/${id}`, {}, getConfig(accessToken));
            toast.success('Habilitation rejetée avec succès!');
            setHabilitations(habilitations.filter((habilitation) => habilitation.id !== id)); // Supprime l'habilitation de la liste
            setSelectedHabilitations(selectedHabilitations.filter((habilitationId) => habilitationId !== id)); // Supprime de la sélection
        } catch (error) {
            console.error('Erreur lors du rejet de l\'habilitation:', error);
            toast.error('Erreur lors du rejet de l\'habilitation');
        }
    };

    const handleAcceptSelected = async () => {
        try {
            await Promise.all(
                selectedHabilitations.map((id) =>
                    axios.post(`${BASE_URL}/habilitations/accept/${id}`, {}, getConfig(accessToken))
                )
            );
            toast.success('Habilitations sélectionnées acceptées avec succès!');
            setHabilitations(habilitations.filter((habilitation) => !selectedHabilitations.includes(habilitation.id)));
            setSelectedHabilitations([]);
        } catch (error) {
            console.error('Erreur lors de l\'acceptation des habilitations sélectionnées:', error);
            toast.error('Erreur lors de l\'acceptation des habilitations sélectionnées');
        }
    };

    const handleRejectSelected = async () => {
        try {
            await Promise.all(
                selectedHabilitations.map((id) =>
                    axios.post(`${BASE_URL}/habilitations/reject/${id}`, {}, getConfig(accessToken))
                )
            );
            toast.success('Habilitations sélectionnées rejetées avec succès!');
            setHabilitations(habilitations.filter((habilitation) => !selectedHabilitations.includes(habilitation.id)));
            setSelectedHabilitations([]);
        } catch (error) {
            console.error('Erreur lors du rejet des habilitations sélectionnées:', error);
            toast.error('Erreur lors du rejet des habilitations sélectionnées');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="habilitation-en-attente w-full max-w-3xl p-4 bg-white shadow-lg rounded-lg text-left">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-left">Habilitations en Attente</h2>
                <div className="mb-4">
                    <button
                        onClick={handleAcceptSelected}
                        disabled={!selectedHabilitations.length}
                        className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600 transition"
                    >
                        Accepter les sélectionnées
                    </button>
                    <button
                        onClick={handleRejectSelected}
                        disabled={!selectedHabilitations.length}
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
                                    checked={selectedHabilitations.length === habilitations.length && habilitations.length > 0}
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
                        {habilitations.length > 0 ? (
                            habilitations.map((habilitation) => (
                                <tr key={habilitation.id} className="border-b">
                                    <td className="px-4 py-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedHabilitations.includes(habilitation.id)}
                                            onChange={() => handleSelectHabilitation(habilitation.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-3">{habilitation.title}</td>
                                    <td className="px-6 py-3">{habilitation.author}</td>
<td className="px-6 py-3">
                                        <a
                                            href={`https://doi.org/${habilitation.doi}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {habilitation.doi}
                                        </a>
                                    </td>                                    <td className="px-6 py-3">
                                        <button
                                            onClick={() => handleAccept(habilitation.id)}
                                            className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600 transition"
                                        >
                                            Accepter
                                        </button>
                                        <button
                                            onClick={() => handleReject(habilitation.id)}
                                            className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                                        >
                                            Rejeter
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4">Aucune habilitation en attente.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HabilitationEnAttente;

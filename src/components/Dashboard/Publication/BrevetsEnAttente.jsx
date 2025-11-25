import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { BASE_URL, getConfig } from '../../../helpers/config';
import { toast } from 'react-toastify';

const BrevetEnAttente = () => {
    const { accessToken, currentUser } = useContext(AuthContext);
    const [brevets, setBrevets] = useState([]);
    const [selectedBrevets, setSelectedBrevets] = useState([]);

    useEffect(() => {
        const fetchBrevets = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/brevets`, getConfig(accessToken));
                const filteredBrevets = response.data.filter(
                    (brevet) => brevet.status === 'en attente' && brevet.id_user !== currentUser.id
                );
                setBrevets(filteredBrevets);
            } catch (error) {
                console.error('Erreur lors de la récupération des brevets en attente:', error);
            }
        };
        fetchBrevets();
    }, [accessToken, currentUser]);

    const handleSelectAll = () => {
        if (selectedBrevets.length === brevets.length) {
            setSelectedBrevets([]); // Désélectionner tout
        } else {
            setSelectedBrevets(brevets.map((brevet) => brevet.id)); // Sélectionner tout
        }
    };

    const handleSelectBrevet = (id) => {
        setSelectedBrevets((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((brevetId) => brevetId !== id) // Désélectionner
                : [...prevSelected, id] // Sélectionner
        );
    };

    const handleAccept = async (id) => {
        try {
            await axios.post(`${BASE_URL}/brevets/accept/${id}`, {}, getConfig(accessToken));
            toast.success('Brevet accepté avec succès!');
            setBrevets(brevets.filter((brevet) => brevet.id !== id)); // Supprime le brevet de la liste
            setSelectedBrevets(selectedBrevets.filter((brevetId) => brevetId !== id)); // Supprime de la sélection
        } catch (error) {
            console.error('Erreur lors de l\'acceptation du brevet:', error);
            toast.error('Erreur lors de l\'acceptation du brevet');
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.post(`${BASE_URL}/brevets/reject/${id}`, {}, getConfig(accessToken));
            toast.success('Brevet rejeté avec succès!');
            setBrevets(brevets.filter((brevet) => brevet.id !== id)); // Supprime le brevet de la liste
            setSelectedBrevets(selectedBrevets.filter((brevetId) => brevetId !== id)); // Supprime de la sélection
        } catch (error) {
            console.error('Erreur lors du rejet du brevet:', error);
            toast.error('Erreur lors du rejet du brevet');
        }
    };

    const handleAcceptSelected = async () => {
        try {
            await Promise.all(
                selectedBrevets.map((id) =>
                    axios.post(`${BASE_URL}/brevets/accept/${id}`, {}, getConfig(accessToken))
                )
            );
            toast.success('Brevets sélectionnés acceptés avec succès!');
            setBrevets(brevets.filter((brevet) => !selectedBrevets.includes(brevet.id)));
            setSelectedBrevets([]);
        } catch (error) {
            console.error('Erreur lors de l\'acceptation des brevets sélectionnés:', error);
            toast.error('Erreur lors de l\'acceptation des brevets sélectionnés');
        }
    };

    const handleRejectSelected = async () => {
        try {
            await Promise.all(
                selectedBrevets.map((id) =>
                    axios.post(`${BASE_URL}/brevets/reject/${id}`, {}, getConfig(accessToken))
                )
            );
            toast.success('Brevets sélectionnés rejetés avec succès!');
            setBrevets(brevets.filter((brevet) => !selectedBrevets.includes(brevet.id)));
            setSelectedBrevets([]);
        } catch (error) {
            console.error('Erreur lors du rejet des brevets sélectionnés:', error);
            toast.error('Erreur lors du rejet des brevets sélectionnés');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="brevet-en-attente w-full max-w-3xl p-4 bg-white shadow-lg rounded-lg text-left">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-left">Brevets en Attente</h2>
                <div className="mb-4">
                    <button
                        onClick={handleAcceptSelected}
                        disabled={!selectedBrevets.length}
                        className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600 transition"
                    >
                        Accepter les sélectionnés
                    </button>
                    <button
                        onClick={handleRejectSelected}
                        disabled={!selectedBrevets.length}
                        className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                    >
                        Rejeter les sélectionnés
                    </button>
                </div>
                <table className="min-w-full border border-gray-300 bg-white divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">
                                <input
                                    type="checkbox"
                                    checked={selectedBrevets.length === brevets.length && brevets.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="px-6 py-3 text-left">Titre</th>
                            <th className="px-6 py-3 text-left">DOI</th>
                            <th className="px-6 py-3 text-left">Auteur</th>
                            <th className="px-6 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-50">
                        {brevets.length > 0 ? (
                            brevets.map((brevet) => (
                                <tr key={brevet.id} className="border-b">
                                    <td className="px-4 py-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedBrevets.includes(brevet.id)}
                                            onChange={() => handleSelectBrevet(brevet.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-3">{brevet.title}</td>
                                    <td className="px-6 py-3">{brevet.author}</td>
                                    <td className="px-6 py-3">
                                        <a
                                            href={`https://doi.org/${brevet.doi}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {brevet.doi}
                                        </a>
                                    </td>
                                    <td className="px-6 py-3">
                                        <button
                                            onClick={() => handleAccept(brevet.id)}
                                            className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600 transition"
                                        >
                                            Accepter
                                        </button>
                                        <button
                                            onClick={() => handleReject(brevet.id)}
                                            className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                                        >
                                            Rejeter
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4">Aucun brevet en attente.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BrevetEnAttente;

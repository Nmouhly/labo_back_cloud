import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { BASE_URL, getConfig } from '../../../helpers/config';
import { toast } from 'react-toastify';

const TheseEnAttente = () => {
    const { accessToken, currentUser } = useContext(AuthContext);
    const [theses, setTheses] = useState([]);
    const [selectedTheses, setSelectedTheses] = useState([]);

    useEffect(() => {
        const fetchTheses = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/theses`, getConfig(accessToken));
                const filteredTheses = response.data.filter(
                    (these) => these.status === 'en attente' && these.id_user !== currentUser.id
                );
                setTheses(filteredTheses);
            } catch (error) {
                console.error('Erreur lors de la récupération des thèses en attente:', error);
            }
        };
        fetchTheses();
    }, [accessToken, currentUser]);

    const handleSelectAll = () => {
        if (selectedTheses.length === theses.length) {
            setSelectedTheses([]); // Désélectionner tout
        } else {
            setSelectedTheses(theses.map((these) => these.id)); // Sélectionner tout
        }
    };

    const handleSelectThese = (id) => {
        setSelectedTheses((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((theseId) => theseId !== id) // Désélectionner
                : [...prevSelected, id] // Sélectionner
        );
    };

    const handleAccept = async (id) => {
        try {
            await axios.post(`${BASE_URL}/theses/accept/${id}`, {}, getConfig(accessToken));
            toast.success('Thèse acceptée avec succès!');
            setTheses(theses.filter((these) => these.id !== id)); // Supprime la thèse de la liste
            setSelectedTheses(selectedTheses.filter((theseId) => theseId !== id)); // Supprime de la sélection
        } catch (error) {
            console.error('Erreur lors de l\'acceptation de la thèse:', error);
            toast.error('Erreur lors de l\'acceptation de la thèse');
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.post(`${BASE_URL}/theses/reject/${id}`, {}, getConfig(accessToken));
            toast.success('Thèse rejetée avec succès!');
            setTheses(theses.filter((these) => these.id !== id)); // Supprime la thèse de la liste
            setSelectedTheses(selectedTheses.filter((theseId) => theseId !== id)); // Supprime de la sélection
        } catch (error) {
            console.error('Erreur lors du rejet de la thèse:', error);
            toast.error('Erreur lors du rejet de la thèse');
        }
    };

    const handleAcceptSelected = async () => {
        try {
            await Promise.all(
                selectedTheses.map((id) =>
                    axios.post(`${BASE_URL}/theses/accept/${id}`, {}, getConfig(accessToken))
                )
            );
            toast.success('Thèses sélectionnées acceptées avec succès!');
            setTheses(theses.filter((these) => !selectedTheses.includes(these.id)));
            setSelectedTheses([]);
        } catch (error) {
            console.error('Erreur lors de l\'acceptation des thèses sélectionnées:', error);
            toast.error('Erreur lors de l\'acceptation des thèses sélectionnées');
        }
    };

    const handleRejectSelected = async () => {
        try {
            await Promise.all(
                selectedTheses.map((id) =>
                    axios.post(`${BASE_URL}/theses/reject/${id}`, {}, getConfig(accessToken))
                )
            );
            toast.success('Thèses sélectionnées rejetées avec succès!');
            setTheses(theses.filter((these) => !selectedTheses.includes(these.id)));
            setSelectedTheses([]);
        } catch (error) {
            console.error('Erreur lors du rejet des thèses sélectionnées:', error);
            toast.error('Erreur lors du rejet des thèses sélectionnées');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="theses-en-attente w-full max-w-3xl p-4 bg-white shadow-lg rounded-lg text-left">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-left">Thèses en Attente</h2>
                <div className="mb-4">
                    <button
                        onClick={handleAcceptSelected}
                        disabled={!selectedTheses.length}
                        className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600 transition"
                    >
                        Accepter les sélectionnées
                    </button>
                    <button
                        onClick={handleRejectSelected}
                        disabled={!selectedTheses.length}
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
                                    checked={selectedTheses.length === theses.length && theses.length > 0}
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
                        {theses.length > 0 ? (
                            theses.map((these) => (
                                <tr key={these.id} className="border-b">
                                    <td className="px-4 py-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedTheses.includes(these.id)}
                                            onChange={() => handleSelectThese(these.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-3">{these.title}</td>
                                    <td className="px-6 py-3">{these.author}</td>
                                    <td className="px-6 py-3">
                                        <a
                                            href={`https://doi.org/${these.doi}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {these.doi}
                                        </a>
                                    </td>
                                    <td className="px-6 py-3">
                                        <button
                                            onClick={() => handleAccept(these.id)}
                                            className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600 transition"
                                        >
                                            Accepter
                                        </button>
                                        <button
                                            onClick={() => handleReject(these.id)}
                                            className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                                        >
                                            Rejeter
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4">Aucune thèse en attente.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TheseEnAttente;

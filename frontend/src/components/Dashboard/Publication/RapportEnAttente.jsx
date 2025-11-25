import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/authContext';
import { BASE_URL, getConfig } from '../../../helpers/config';
import { toast } from 'react-toastify';

const RapportEnAttente = () => {
    const { accessToken, currentUser } = useContext(AuthContext);
    const [rapports, setRapports] = useState([]);
    const [selectedRapports, setSelectedRapports] = useState([]);

    useEffect(() => {
        const fetchRapports = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/reports`, getConfig(accessToken));
                const filteredRapports = response.data.filter(
                    (rapport) => rapport.status === 'en attente' && rapport.id_user !== currentUser.id
                );
                setRapports(filteredRapports);
            } catch (error) {
                console.error('Erreur lors de la récupération des rapports en attente:', error);
            }
        };
        fetchRapports();
    }, [accessToken, currentUser]);

    const handleSelectAll = () => {
        if (selectedRapports.length === rapports.length) {
            setSelectedRapports([]); // Désélectionner tout
        } else {
            setSelectedRapports(rapports.map((rapport) => rapport.id)); // Sélectionner tout
        }
    };

    const handleSelectRapport = (id) => {
        setSelectedRapports((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((rapportId) => rapportId !== id) // Désélectionner
                : [...prevSelected, id] // Sélectionner
        );
    };

    const handleAccept = async (id) => {
        try {
            await axios.post(`${BASE_URL}/reports/accept/${id}`, {}, getConfig(accessToken));
            toast.success('Rapport accepté avec succès!');
            setRapports(rapports.filter((rapport) => rapport.id !== id)); // Supprime le rapport de la liste
            setSelectedRapports(selectedRapports.filter((rapportId) => rapportId !== id)); // Supprime de la sélection
        } catch (error) {
            console.error('Erreur lors de l\'acceptation du rapport:', error);
            toast.error('Erreur lors de l\'acceptation du rapport');
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.post(`${BASE_URL}/reports/reject/${id}`, {}, getConfig(accessToken));
            toast.success('Rapport rejeté avec succès!');
            setRapports(rapports.filter((rapport) => rapport.id !== id)); // Supprime le rapport de la liste
            setSelectedRapports(selectedRapports.filter((rapportId) => rapportId !== id)); // Supprime de la sélection
        } catch (error) {
            console.error('Erreur lors du rejet du rapport:', error);
            toast.error('Erreur lors du rejet du rapport');
        }
    };

    const handleAcceptSelected = async () => {
        try {
            await Promise.all(
                selectedRapports.map((id) =>
                    axios.post(`${BASE_URL}/reports/accept/${id}`, {}, getConfig(accessToken))
                )
            );
            toast.success('Rapports sélectionnés acceptés avec succès!');
            setRapports(rapports.filter((rapport) => !selectedRapports.includes(rapport.id)));
            setSelectedRapports([]);
        } catch (error) {
            console.error('Erreur lors de l\'acceptation des rapports sélectionnés:', error);
            toast.error('Erreur lors de l\'acceptation des rapports sélectionnés');
        }
    };

    const handleRejectSelected = async () => {
        try {
            await Promise.all(
                selectedRapports.map((id) =>
                    axios.post(`${BASE_URL}/reports/reject/${id}`, {}, getConfig(accessToken))
                )
            );
            toast.success('Rapports sélectionnés rejetés avec succès!');
            setRapports(rapports.filter((rapport) => !selectedRapports.includes(rapport.id)));
            setSelectedRapports([]);
        } catch (error) {
            console.error('Erreur lors du rejet des rapports sélectionnés:', error);
            toast.error('Erreur lors du rejet des rapports sélectionnés');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="rapport-en-attente w-full max-w-3xl p-4 bg-white shadow-lg rounded-lg text-left">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-left">Rapports en Attente</h2>
                <div className="mb-4">
                    <button
                        onClick={handleAcceptSelected}
                        disabled={!selectedRapports.length}
                        className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600 transition"
                    >
                        Accepter les sélectionnés
                    </button>
                    <button
                        onClick={handleRejectSelected}
                        disabled={!selectedRapports.length}
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
                                    checked={selectedRapports.length === rapports.length && rapports.length > 0}
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
                        {rapports.length > 0 ? (
                            rapports.map((rapport) => (
                                <tr key={rapport.id} className="border-b">
                                    <td className="px-4 py-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedRapports.includes(rapport.id)}
                                            onChange={() => handleSelectRapport(rapport.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-3">{rapport.title}</td>
                                    <td className="px-6 py-3">{rapport.author}</td>
                                    <td className="px-6 py-3">
                                        <a
                                            href={`https://doi.org/${rapport.DOI}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {rapport.DOI}
                                        </a>
                                    </td>
                                    <td className="px-6 py-3">
                                        <button
                                            onClick={() => handleAccept(rapport.id)}
                                            className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600 transition"
                                        >
                                            Accepter
                                        </button>
                                        <button
                                            onClick={() => handleReject(rapport.id)}
                                            className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition"
                                        >
                                            Rejeter
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4">Aucun rapport en attente.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RapportEnAttente;

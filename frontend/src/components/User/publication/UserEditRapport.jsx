import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserEditRapport = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [DOI, setDOI] = useState('');
    const [members, setMembers] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [selectedAuthorIds, setSelectedAuthorIds] = useState([]);
    const [optionalAuthors, setOptionalAuthors] = useState([]);
    const [error, setError] = useState('');
    const [rapport, setRapport] = useState(null); // État pour le rapport
    const { currentUser, accessToken } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMembers();
        fetchRapportDetails();
    }, [id, accessToken]);

    const fetchRapportDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/rapportUser/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            const rapportData = response.data;
            setRapport(rapportData);
            setTitle(rapportData.title);
            setDOI(rapportData.doi);
            setSelectedAuthors(rapportData.authors_with_ids || []);
            setSelectedAuthorIds(rapportData.author_ids || []);
            setOptionalAuthors(rapportData.authors_without_ids || []);
        } catch (error) {
            console.error('Erreur lors de la récupération du rapport :', error);
            setError('Erreur lors de la récupération du rapport');
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/members', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            // Filtrer pour exclure l'utilisateur connecté
            const filteredMembers = response.data.filter(member => member.name !== currentUser.name);
            setMembers(filteredMembers);
        } catch (error) {
            console.error('Erreur lors de la récupération des membres :', error);
            setError('Erreur lors de la récupération des membres');
            toast.error('Erreur lors de la récupération des membres');
        }
    };

    const validateDoi = (doi) => {
        const doiPattern = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
        return doiPattern.test(doi);
    };

    const checkDoiExists = async (doi, excludedDoi) => {
        try {
            const response = await axios.post('http://localhost:8000/api/checkDOIExistsRapport', { doi }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            return response.data.exists && doi !== excludedDoi;
        } catch (error) {
            console.error('Erreur lors de la vérification du DOI :', error);
            setError('Erreur lors de la vérification du DOI');
            return false;
        }
    };

    const handleAuthorSelection = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const names = selectedOptions.map((option) => option.value);
        const ids = selectedOptions.map((option) => option.getAttribute('data-id'));

        const filteredNames = names.filter((name) => name !== currentUser.name);
        const filteredIds = ids.filter((id) => id !== currentUser.id.toString());

        setSelectedAuthors([...filteredNames]);
        setSelectedAuthorIds([...filteredIds]);
    };

    const handleAddOptionalAuthor = () => {
        setOptionalAuthors([...optionalAuthors, '']);
    };

    const handleOptionalAuthorChange = (index, value) => {
        const newOptionalAuthors = [...optionalAuthors];
        newOptionalAuthors[index] = value;
        setOptionalAuthors(newOptionalAuthors);
    };

    const handleRemoveOptionalAuthor = (index) => {
        const newOptionalAuthors = optionalAuthors.filter((_, i) => i !== index);
        setOptionalAuthors(newOptionalAuthors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateDoi(DOI)) {
            setError('Format du DOI invalide.');
            toast.error('Format du DOI invalide.');
            return;
        }

        const doiExists = DOI !== rapport?.doi && await checkDoiExists(DOI, rapport?.doi);

        if (doiExists) {
            setError('Le DOI existe déjà.');
            toast.error('Le DOI existe déjà.');
            return;
        }

        let allAuthors = [...selectedAuthors];
        let allAuthorIds = [...selectedAuthorIds];

        optionalAuthors.forEach((optionalAuthor) => {
            if (!allAuthors.includes(optionalAuthor)) {
                allAuthors.push(optionalAuthor);
            }
        });

        if (!allAuthors.includes(currentUser.name)) {
            allAuthors = [currentUser.name, ...allAuthors];
            allAuthorIds = [currentUser.id.toString(), ...allAuthorIds];
        }

        const payload = {
            title,
            author_names: [...new Set(allAuthors)],
            DOI,
            id_user: [...new Set(allAuthorIds)].join(','),
            current_user_id: currentUser.id,
            optional_authors: optionalAuthors,
        };

        try {
            await axios.put(`http://localhost:8000/api/rapportUser/${id}`, payload, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            toast.success('Rapport modifié avec succès');
            navigate('/user/UserRapport'); // Change the navigation to the appropriate route
        } catch (error) {
            console.error('Erreur lors de la mise à jour du rapport :', error.response ? error.response.data : error.message);
            setError('Erreur lors de la mise à jour du rapport');
            toast.error('Erreur lors de la mise à jour du rapport');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Modifier le rapport</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Titre</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Membre(s)</label>
                    <select
    multiple
    value={selectedAuthors}
    onChange={handleAuthorSelection}
    className="w-full p-2 border border-gray-300 rounded"
>
    {members.map(member => (
        <option key={member.id} value={member.name} data-id={member.user_id}> {/* user_id de la table users */}
            {member.name}
        </option>
    ))}
</select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Autre auteur(s)</label>
                    <div className="space-y-2">
                        {optionalAuthors.map((author, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input
                                    type="text"
                                    value={author}
                                    onChange={(e) => handleOptionalAuthorChange(index, e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveOptionalAuthor(index)}
                                    className="ml-2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                >
                                    &minus;
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleAddOptionalAuthor}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Ajouter un auteur 
                    </button>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">DOI</label>
                    <input
                        type="text"
                        value={DOI}
                        onChange={(e) => setDOI(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Enregistrer
                </button>
            </form>
        </div>
    );
};

export default UserEditRapport;

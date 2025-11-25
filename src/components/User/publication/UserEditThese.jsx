import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserEditThèse = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [DOI, setDOI] = useState('');
    const [date, setDate] = useState('');
    const [lieu, setLieu] = useState('');
    const [members, setMembers] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [selectedAuthorIds, setSelectedAuthorIds] = useState([]);
    const [optionalAuthors, setOptionalAuthors] = useState([]);
    const [error, setError] = useState('');
    const [these, setThese] = useState(null);
    const { currentUser, accessToken } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMembers();
        fetchTheseDetails();
    }, [id, accessToken]);

    const fetchTheseDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/thesesUser/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            const theseData = response.data;
            setThese(theseData); // Correcting this line
            setTitle(theseData.title);
            setDOI(theseData.doi);
            setDate(theseData.date);
            setLieu(theseData.lieu);
    
            setSelectedAuthors(theseData.authors_with_ids || []);
            setSelectedAuthorIds(theseData.author_ids || []);
            setOptionalAuthors(theseData.authors_without_ids || []);
        } catch (error) {
            console.error('Erreur lors de la récupération du thèse :', error);
            setError('Erreur lors de la récupération du thèse');
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
            const response = await axios.post('http://localhost:8000/api/checkDOIExistsThèse', { doi }, {
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

        const doiExists = DOI !== these?.doi && await checkDoiExists(DOI, these?.doi);

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
            title: title,
            doi: DOI.trim(), // Assurez-vous d'utiliser 'doi' en minuscules
            current_user_id: currentUser.id,
            author_names: [...new Set(allAuthors)],
            id_user: [...new Set(allAuthorIds)].join(','),
            optional_authors: optionalAuthors,
            lieu: lieu,
            date: date
        };
        

        try {
            await axios.put(`http://localhost:8000/api/thesesUser/${id}`, payload, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            toast.success('these modifié avec succès');
            navigate('/user/UserThèse');
        } catch (error) {
            console.error('Erreur lors de la mise à jour du Thèse :', error.response ? error.response.data : error.message);
            setError('Erreur lors de la mise à jour du Thèse');
            toast.error('Erreur lors de la mise à jour du Thèse');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Modifier le brevet</h1>
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
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
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
                <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                {/* Lieu field */}
                <div>
                    <label className="block text-sm font-medium mb-1">Lieu</label>
                    <input
                        type="text"
                        value={lieu}
                        onChange={(e) => setLieu(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <button type="submit" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
                        Modifier le brevet
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserEditThèse;

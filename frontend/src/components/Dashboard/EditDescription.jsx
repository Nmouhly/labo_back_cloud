import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill editor style

const EditDescription = () => {
    const { id } = useParams(); // Retrieve the ID of the description from URL params
    const [content, setContent] = useState('');
    const { accessToken } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDescription();
        // Ensure that the styles are applied when component mounts
        addCustomQuillStyles();
    }, [id]);

    const fetchDescription = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/home-descriptions/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setContent(response.data.content); // Pre-fill content with fetched data
        } catch (error) {
            const errorMessage = error.response 
                ? `${error.response.data.message || 'Unknown server error'} - Code: ${error.response.status}`
                : error.message || 'Unknown error';
            console.error('Error fetching description:', errorMessage);
            toast.error(`Error fetching description: ${errorMessage}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            toast.error('Content is required.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8000/api/home-descriptions/${id}`, {
                content
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status === 200) {
                toast.success('Description updated successfully');
                navigate('/dashboard/AdminHomeDescription');
            } else {
                throw new Error('Unexpected server response');
            }
        } catch (error) {
            const errorMessage = error.response
                ? `${error.response.data.message || 'Unknown server error'} - Code: ${error.response.status}`
                : error.message || 'Unknown error';
            console.error('Error updating description:', errorMessage);
            toast.error(`Error updating description: ${errorMessage}`);
        }
    };

    const addCustomQuillStyles = () => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
            .ql-editor a {
                color: #00bfff !important; /* Light sky blue color with !important */
                text-decoration: none; /* Optional: remove underline */
            }
            .ql-editor a:hover {
                text-decoration: underline; /* Optional: underline on hover */
            }
        `;
        document.head.appendChild(styleElement);
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Modifier la  Description</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="content" className="block text-gray-700">Contenu</label>
                    <ReactQuill
                        id="content"
                        value={content}
                        onChange={setContent}
                        placeholder="Enter content here..."
                        className="border px-4 py-2 w-full"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Mettre à jour
                </button>
            </form>
        </div>
    );
};

export default EditDescription;

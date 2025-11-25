import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const ReportAdmin = () => {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchReports();
    }, [accessToken]);

    const fetchReports = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/reportsAdmin', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setReports(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des rapports', error);
            setError('Erreur lors de la récupération des rapports');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
            try {
                const response = await axios.delete(`http://localhost:8000/api/reports/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (response.status === 200) {
                    setReports(reports.filter(report => report.id !== id));
                    alert('Rapport supprimé avec succès');
                } else {
                    throw new Error('Erreur de suppression');
                }
            } catch (error) {
                console.error('Erreur lors de la suppression du rapport', error);
                setError('Erreur lors de la suppression du rapport');
            }
        }
    };

    return (
        <div className="container mt-5">
            <h1 className=" mb-4">Gestion des Rapports</h1>
            <Link to="/dashboard/ReportCreate" className="btn btn-primary mb-4">Ajouter un Rapport</Link>
            {error && <p className="text-danger mb-4">{error}</p>}
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="thead-light">
                        <tr>
                            <th>Titre</th>
                            <th>Auteur</th>
                            <th>DOI</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length > 0 ? (
                            reports.map(report => (
                                <tr key={report.id}>
                                    <td>{report.title}</td>
                                    <td>{report.author}</td>
                                    <td>
                                        {report.DOI ? (
                                            <a
                                                href={`https://doi.org/${report.DOI}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => {
                                                    const isValidDOI = report.DOI.startsWith('10.');
                                                    if (!isValidDOI) {
                                                        e.preventDefault();
                                                        alert('Le DOI fourni semble invalide ou non trouvé. Vous pouvez essayer le lien PDF si disponible.');
                                                    }
                                                }}
                                            >
                                                {report.DOI}
                                            </a>
                                        ) : (
                                            'Pas de DOI disponible'
                                        )}
                                    </td>
                                    <td>{report.status}</td>
                                    <td className="d-flex align-items-center">
    <Link to={`/dashboard/ReportEdit/${report.id}`} className="btn btn-primary mb-2">Modifier</Link>
    <button onClick={() => handleDelete(report.id)} className="btn btn-danger mb-2">Supprimer</button>
</td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">Aucun rapport disponible</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportAdmin;

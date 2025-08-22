import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [documents, setDocuments] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const token = user ? user.token : null;
                const { data } = await axios.get('http://localhost:5000/api/documents', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDocuments(data);
            } catch (error) {
                console.error('Failed to fetch documents:', error);
                navigate('/');
            }
        };
        fetchDocuments();
    }, [navigate]);

    const filteredDocs = documents.filter(doc =>
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        (doc.author && doc.author.toLowerCase().includes(search.toLowerCase()))
    );

    const highlightText = (text, query) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, "gi");
        return text.split(regex).map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? <mark key={i}>{part}</mark> : part
        );
    };

    return (
        <div
            className="min-vh-100 py-5"
            style={{ background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" }}
        >
            <div className="container">

                <h2 className="my-4 text-center text-primary">Dashboard</h2>

                {/* Search Bar */}
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control shadow-sm rounded-3"
                        placeholder="Search by title or author..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Documents List */}
                <div className="row">
                    {filteredDocs.length > 0 ? (
                        filteredDocs.map((doc) => (
                            <div key={doc._id} className="col-md-4 mb-4">
                                <div className="card h-100 shadow-lg rounded-4">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">
                                            {highlightText(doc.title, search)}
                                        </h5>
                                        <p className="card-text text-muted">
                                            Author: {highlightText(doc.author || "Unknown", search)}
                                        </p>
                                        <p className="card-text">
                                            Created on: {new Date(doc.createdAt).toLocaleDateString()}
                                        </p>
                                        <Link
                                            to={`/document/${doc._id}`}
                                            className="btn btn-primary mt-auto shadow-sm"
                                        >
                                            Open Document
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">No documents found.</p>
                    )}
                </div>

                {/* Create New Document Button */}
                <div className="text-center mt-4">
                    <button
                        className="btn btn-success shadow-sm"
                        onClick={() => navigate('/document/new')}
                    >
                        Create New Document
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

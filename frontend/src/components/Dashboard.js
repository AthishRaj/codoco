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
            style={{ background: "linear-gradient(135deg,  #93fffaff 0%, #efacfdff  100%)" }}
        >
            <div className="container px-3">

                {/* Heading */}
                <h1 className="display-4 fw-bold text-center text-dark mb-5">
                    All <span style={{ color: "#2575fc" }}>Documents</span>
                </h1>

                {/* Search Bar */}
                <div className="mb-5 d-flex justify-content-center">
                    <input
                        type="text"
                        className="form-control shadow-sm rounded-pill"
                        style={{ maxWidth: "400px", padding: "12px 20px" }}
                        placeholder="Search by title or author..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Documents List */}
                <div className="row g-4">
                    {filteredDocs.length > 0 ? (
                        filteredDocs.map((doc) => (
                            <div key={doc._id} className="col-12 col-sm-6 col-lg-4">
                                <div className="card h-100 shadow-lg rounded-4 border-0">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title fw-bold">
                                            {highlightText(doc.title, search)}
                                        </h5>
                                        <p className="card-text text-muted mb-2">
                                            Author: {highlightText(doc.author || "Unknown", search)}
                                        </p>
                                        <p className="card-text mb-3">
                                            Created on: {new Date(doc.createdAt).toLocaleDateString()}
                                        </p>
                                        <Link
                                            to={`/document/${doc._id}`}
                                            className="btn btn-primary mt-auto rounded-pill shadow-sm"
                                            style={{ transition: "all 0.3s" }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                                        >
                                            Open Document
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted mt-4">No documents found.</p>
                    )}
                </div>

                {/* Create New Document Button */}
                <div className="text-center mt-5">
                    <button
                        className="btn btn-success rounded-pill shadow-sm px-5 py-2 fw-bold"
                        style={{ transition: "all 0.3s" }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
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

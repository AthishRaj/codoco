import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    // State to store all fetched documents
    const [documents, setDocuments] = useState([]);
    // State to hold the current search input
    const [search, setSearch] = useState(""); 
    // React Router hook to programmatically navigate
    const navigate = useNavigate();

    // Fetch documents when the component mounts
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                // Get logged-in user info from localStorage
                const user = JSON.parse(localStorage.getItem('user'));
                const token = user ? user.token : null;

                // Call backend API to get documents (with auth header)
                const { data } = await axios.get('http://localhost:5000/api/documents', {
                    headers: {
                        Authorization: `Bearer ${token}`, // send token for authentication
                    },
                });

                // Save documents to state
                setDocuments(data);
            } catch (error) {
                console.error('Failed to fetch documents:', error);
                // If fetching fails (like invalid token), redirect to home
                navigate('/');
            }
        };

        fetchDocuments();
    }, [navigate]); // Re-run if "navigate" changes (usually only once)

    // Filter documents based on search text (title or author)
    const filteredDocs = documents.filter(doc =>
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        (doc.author && doc.author.toLowerCase().includes(search.toLowerCase()))
    );

    // Highlight search text inside title/author for better UX
    const highlightText = (text, query) => {
        if (!query) return text; // if no search, return text as-is

        // Regex to find search term (case-insensitive)
        const regex = new RegExp(`(${query})`, "gi");

        // Split text by search term and wrap matched parts in <mark>
        return text.split(regex).map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <mark key={i}>{part}</mark>
            ) : (
                part
            )
        );
    };

    return (
        <div className="container">
            <h2 className="my-4">Dashboard</h2>

            {/* 🔹 Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by title or author..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} // update search state
                />
            </div>

            {/* 🔹 Documents List */}
            <div className="row">
                {filteredDocs.length > 0 ? (
                    filteredDocs.map((doc) => (
                        <div key={doc._id} className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body d-flex flex-column">
                                    {/* Highlighted title */}
                                    <h5 className="card-title">
                                        {highlightText(doc.title, search)}
                                    </h5>

                                    {/* Highlighted author */}
                                    <p className="card-text text-muted">
                                       Author: {highlightText(doc.author || "Unknown", search)}
                                    </p>

                                    {/* Document creation date */}
                                    <p className="card-text">
                                        Created on: {new Date(doc.createdAt).toLocaleDateString()}
                                    </p>

                                    {/* Link to open a specific document */}
                                    <Link
                                        to={`/document/${doc._id}`}
                                        className="btn btn-primary mt-auto"
                                    >
                                        Open Document
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    // If no documents match search
                    <p className="text-center text-muted">No documents found.</p>
                )}
            </div>

            {/* 🔹 Create New Document Button */}
            <div className="text-center">
                <button
                    className="btn btn-success mt-4"
                    onClick={() => navigate('/document/new')}
                >
                    Create New Document
                </button>
            </div>
        </div>
    );
};

export default Dashboard;

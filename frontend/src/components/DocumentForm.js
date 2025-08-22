import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DocumentForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user ? user.token : null;

            const { data } = await axios.post(
                'http://localhost:5000/api/documents',
                { title, content },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            navigate(`/document/${data._id}`, { state: { message: 'Document created successfully!' } });
        } catch (error) {
            console.error('Failed to create document:', error);
        }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center vh-100"
            style={{
                background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" // same pastel gradient as Login
            }}
        >
            <div className="p-5 bg-white rounded-4 shadow-lg w-100" style={{ maxWidth: "600px" }}>
                <h2 className="mb-4 text-primary text-center">Create New Document</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-start">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input
                            type="text"
                            className="form-control shadow-sm"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label htmlFor="content" className="form-label">Content</label>
                        <textarea
                            className="form-control shadow-sm"
                            id="content"
                            rows="6"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 shadow-sm">Create</button>
                </form>
            </div>
        </div>
    );
};

export default DocumentForm;

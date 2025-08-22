import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DocumentForm = () => {
    // 🔹 State to store the document title and content
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // 🔹 Hook to programmatically navigate to another route
    const navigate = useNavigate();

    // 🔹 Function triggered when the form is submitted
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent default page refresh on form submit
        try {
            // Get the logged-in user details from localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            
            // Extract the token (for authentication with backend)
            const token = user ? user.token : null;
           

            // Send POST request to backend API to create a new document
            const { data } = await axios.post(
                'http://localhost:5000/api/documents', // API endpoint
                { title, content }, // request body
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // attach JWT token in header
                    },
                }
            );

            // After creating, navigate to the new document's detail page
            // and optionally pass a success message in "state"
            navigate(`/document/${data._id}`, { state: { message: 'Document created successfully!' } });
        } catch (error) {
            // If request fails, log the error
            console.error('Failed to create document:', error);
        }
    };

    return (
        <div className="container">
            <h2>Create New Document</h2>
            
            {/* Form to create new document */}
            <form onSubmit={handleSubmit}>
                {/* Title input field */}
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title} // bind input value to state
                        onChange={(e) => setTitle(e.target.value)} // update state on change
                        required
                    />
                </div>

                {/* Content textarea field */}
                <div className="mb-3">
                    <label htmlFor="content" className="form-label">Content</label>
                    <textarea
                        className="form-control"
                        id="content"
                        value={content} // bind textarea value to state
                        onChange={(e) => setContent(e.target.value)} // update state on change
                        required
                    />
                </div>

                {/* Submit button */}
                <button type="submit" className="btn btn-primary">
                    Create
                </button>
            </form>
        </div>
    );
};

export default DocumentForm;

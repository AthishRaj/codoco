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
  className="d-flex align-items-center justify-content-center min-vh-100 px-3"
  style={{ background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" }}
>
  <div
    className="p-4 p-md-5 bg-white rounded-5 shadow-lg w-100"
    style={{ maxWidth: "600px" }}
  >
    <h2 className="mb-4 text-center fw-bold" style={{ color: "#2575fc" }}>
      Create New Document
    </h2>

    <form onSubmit={handleSubmit}>
      {/* Title Input */}
      <div className="mb-3 text-start">
        <label htmlFor="title" className="form-label fw-semibold">Title</label>
        <input
          type="text"
          id="title"
          className="form-control rounded-pill shadow-sm px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter document title"
          required
        />
      </div>

      {/* Content Textarea */}
      <div className="mb-4 text-start">
        <label htmlFor="content" className="form-label fw-semibold">Content</label>
        <textarea
          id="content"
          className="form-control rounded-3 shadow-sm px-3 py-2"
          rows="6"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your content here..."
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="btn w-100 rounded-pill fw-bold"
        style={{
          backgroundColor: "#2575fc",
          color: "#fff",
          padding: "10px 0",
          boxShadow: "0 4px 15px rgba(37, 117, 252, 0.3)",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        Create
      </button>
    </form>
  </div>
</div>

    );
};

export default DocumentForm;

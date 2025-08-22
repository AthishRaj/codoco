import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getDocumentById, updateDocument, deleteDocument } from '../services/documentService';
import { io } from 'socket.io-client'

const DocumentDetails = () => {
    const socket = io('http://localhost:5000');
    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const username = JSON.parse(localStorage.getItem("user"))?.username || "Anonymous";
    const location = useLocation();
    const message = location.state?.message;

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const doc = await getDocumentById(id);
                setDocument(doc);
                setTitle(doc.title);
                setContent(doc.content);
            } catch {
                setError('Failed to fetch document');
            }
        };
        fetchDocument();
    }, [id]);

    useEffect(() => {
        socket.emit('joinDocument', id);

        socket.on('receiveUpdate', (updatedData) => {
            if (updatedData.title) setTitle(updatedData.title);
            if (updatedData.content) setContent(updatedData.content);
        });

        socket.on("receiveMessage", (msg) => {
            setChatMessages((prev) => [...prev, msg]);
        });

        return () => socket.disconnect();
    }, [id, socket]);

    const handleUpdate = async () => {
        try {
            await updateDocument(id, { title, content });
            socket.emit('documentUpdate', { documentId: id, title, content });
            setSuccessMessage('Document updated successfully!');
            navigate(`/document/${id}`);
        } catch {
            setError('Failed to update document');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteDocument(id);
            navigate('/dashboard');
        } catch {
            setError('Failed to delete document');
        }
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        socket.emit("sendMessage", { documentId: id, username, message: newMessage });
        setNewMessage("");
    };

    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!document) return <div>Loading...</div>;

    return (
        <div
  className="min-vh-100 py-5"
  style={{ background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" }}
>
  <div className="container px-3">

    {/* Success message from navigation */}
    {message && <div className="alert alert-success mt-3">{message}</div>}

    {/* Main card */}
    <div className="p-4 p-md-5 bg-white rounded-5 shadow-lg">
      <h2 className="mb-4 text-dark fw-bold">Document Details</h2>

      {/* Title input */}
      <div className="form-group mb-3">
        <label htmlFor="title" className="form-label fw-semibold">Title</label>
        <input
          type="text"
          id="title"
          className="form-control rounded-pill shadow-sm px-3 py-2"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            socket.emit('documentUpdate', { documentId: id, title: e.target.value, content });
          }}
          placeholder="Enter document title"
        />
      </div>

      {/* Content textarea */}
      <div className="form-group mb-3">
        <label htmlFor="content" className="form-label fw-semibold">Content</label>
        <textarea
          id="content"
          className="form-control rounded-3 shadow-sm px-3 py-2"
          rows="6"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            socket.emit('documentUpdate', { documentId: id, title, content: e.target.value });
          }}
          placeholder="Write your content here..."
        />
      </div>

      {/* Success message */}
      {successMessage && <div className="alert alert-success mb-3">{successMessage}</div>}

      {/* Action buttons */}
      <div id="buttons" className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
        <button
          className="btn btn-primary rounded-pill shadow-sm flex-fill"
          style={{ transition: "all 0.3s" }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          onClick={handleUpdate}
        >
          Update Document
        </button>
        <button
          className="btn btn-danger rounded-pill shadow-sm flex-fill"
          style={{ transition: "all 0.3s" }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          onClick={handleDelete}
        >
          Delete Document
        </button>
      </div>

      {/* Live Chat */}
      <h4 className="mb-3 text-dark fw-semibold">Live Chat</h4>
      <div className="border p-3 mb-3 rounded-3 bg-light" style={{ maxHeight: "250px", overflowY: "auto" }}>
        {chatMessages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <strong>{msg.username}:</strong> {msg.message}
            <span className="text-muted small ms-2">
              {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
            </span>
          </div>
        ))}
      </div>

      {/* Chat input */}
      <div className="d-flex flex-column flex-md-row gap-2">
        <input
          type="text"
          className="form-control rounded-pill shadow-sm px-3 py-2 flex-fill"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="btn btn-success rounded-pill shadow-sm flex-shrink-0"
          style={{ transition: "all 0.3s" }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  </div>
</div>

    );
};

export default DocumentDetails;

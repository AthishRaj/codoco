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
            <div className="container">
                {message && <div className="alert alert-success mt-3">{message}</div>}

                <div className="p-4 bg-white rounded-4 shadow-lg">
                    <h2 className="mb-4 text-primary">Document Details</h2>

                    <div className="form-group mb-3">
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            className="form-control"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                socket.emit('documentUpdate', { documentId: id, title: e.target.value, content });
                            }}
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="content">Content:</label>
                        <textarea
                            id="content"
                            className="form-control"
                            rows="6"
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value);
                                socket.emit('documentUpdate', { documentId: id, title, content: e.target.value });
                            }}
                        />
                    </div>

                    {successMessage && <div className="alert alert-success mb-3">{successMessage}</div>}

                    <div id="buttons" className="d-flex mb-4 justify-content-between">
                        <button
                            className="btn btn-primary shadow-sm"
                            onClick={handleUpdate}
                        >
                            Update Document
                        </button>
                        <button
                            className="btn btn-danger shadow-sm"
                            onClick={handleDelete}
                        >
                            Delete Document
                        </button>
                    </div>





                    <h4 className="mb-3">Live Chat</h4>
                    <div className="border p-3 mb-3 rounded-3 bg-light" style={{ maxHeight: "250px", overflowY: "auto" }}>
                        {chatMessages.map((msg, idx) => (
                            <div key={idx}>
                                <strong>{msg.username}:</strong> {msg.message}
                                <span className="text-muted small ms-2">
                                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="d-flex">
                        <input
                            type="text"
                            className="form-control"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                        />
                        <button className="btn btn-success ms-2" onClick={handleSendMessage}>
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentDetails;

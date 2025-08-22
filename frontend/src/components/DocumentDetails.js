import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getDocumentById, updateDocument, deleteDocument } from '../services/documentService';
import { io } from 'socket.io-client';

// Component to show, edit, and collaborate on a single document
const DocumentDetails = () => {
    // Connect to backend WebSocket server (for real-time collaboration)
    const socket = io('http://localhost:5000');

    // Extract the document ID from the URL (/document/:id)
    const { id } = useParams();

    // Hook to programmatically navigate between routes
    const navigate = useNavigate();

    // State variables for document data
    const [document, setDocument] = useState(null);   // Full document object
    const [title, setTitle] = useState('');           // Editable title
    const [content, setContent] = useState('');       // Editable content
    const [error, setError] = useState(null);         // Error messages
    const [successMessage, setSuccessMessage] = useState(null); // Success messages

    //  chat state
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const username = JSON.parse(localStorage.getItem("user"))?.username || "Anonymous";

    // Used to check if a message was passed when navigating (e.g. "document created")
    const location = useLocation();
    const message = location.state?.message;

    // Fetch the document details when component loads or when `id` changes
    useEffect(() => {
        const fetchDocument = async () => {
            try {
                // Get document data from backend API
                const doc = await getDocumentById(id);
                setDocument(doc);         // Store full doc
                setTitle(doc.title);      // Set title input field
                setContent(doc.content);  // Set content textarea
            } catch (error) {
                setError('Failed to fetch document');
            }
        };
        fetchDocument();
    }, [id]); // Runs again if the document ID changes

    // Setup socket.io for real-time updates
    useEffect(() => {
        // Join this specific document's "room" (so only people on same doc receive updates)
        socket.emit('joinDocument', id);

        // Listen for updates from other users (title/content changes)
        socket.on('receiveUpdate', (updatedData) => {
            if (updatedData.title) {
                setTitle(updatedData.title);
            }
            if (updatedData.content) {
                setContent(updatedData.content);
            }
        });

        //  listen for incoming chat messages
        socket.on("receiveMessage", (msg) => {
            setChatMessages((prev) => [...prev, msg]);
        });

        // (Optional extra listener — seems like a duplicate for updating content only)
        socket.on('receiveUpdatedTitle', (updatedContent) => {
            setContent(updatedContent);
        });

        // Disconnect socket when component unmounts to avoid memory leaks
        return () => {
            socket.disconnect();
        };
    }, [id, socket]);

    // Handle saving updated document to backend
    const handleUpdate = async () => {
        try {
            await updateDocument(id, { title, content }); // Save to database
            socket.emit('documentUpdate', { documentId: id, title, content }); // Notify others via socket
            setSuccessMessage('Document updated successfully!');
            navigate(`/document/${id}`); // Refresh/reload current page
        } catch (error) {
            setError('Failed to update document');
        }
    };

    // Handle deleting a document
    const handleDelete = async () => {
        try {
            await deleteDocument(id);   // Delete from backend
            navigate('/dashboard');     // Redirect to dashboard after deletion
        } catch (error) {
            setError('Failed to delete document');
        }
    };

    // send chat message
    const handleSendMessage = () => {
        if (newMessage.trim() === "") return;
        // const newMessage = {
        //     user: "You",
        //     text: chatInput,
        //     timestamp: new Date().toISOString(), // 👈 send proper ISO timestamp
        // };
        socket.emit("sendMessage", { documentId: id, username, message: newMessage });
        setNewMessage("");
    };

    // If there’s an error, show alert
    if (error) return <div className="alert alert-danger">{error}</div>;

    // While data is being fetched, show loading
    if (!document) return <div>Loading...</div>;

    return (
        <div className="container mt-5">
            {/* Show success message passed from previous page */}
            {message && <div className="alert alert-success mt-3">{message}</div>}

            <h2 className="mb-4">Document Details</h2>

            {/* Title input field */}
            <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    className="form-control"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value); // Update local state
                        // Send changes to server in real-time
                        socket.emit('documentUpdate', { documentId: id, title: e.target.value, content });
                    }}
                />
            </div>

            {/* Content textarea */}
            <div className="form-group mt-3">
                <label htmlFor="content">Content:</label>
                <textarea
                    id="content"
                    className="form-control"
                    rows="5"
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value); // Update local state
                        // Send changes to server in real-time
                        socket.emit('documentUpdate', { documentId: id, title, content: e.target.value });
                    }}
                />
            </div>

            {/* Show success message after saving */}
            {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}

            {/* Action buttons */}
            <div className="mt-3">
                <button className="btn btn-primary" onClick={handleUpdate}>Update Document</button>
                <button className="btn btn-danger ms-2" onClick={handleDelete}>Delete Document</button>
            </div>
            <div className="mt-5">
                <h4>Live Chat</h4>
                <div className="border p-3 mb-3" style={{ maxHeight: "250px", overflowY: "auto" }}>
                    {chatMessages.map((msg, idx) => (
                        <div key={idx}>
                            <strong>{msg.username}: </strong>{msg.message}
                            <span className="text-muted small ms-2">
                                {new Date(msg.timestamp).toLocaleTimeString()}
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
    );
};

export default DocumentDetails;

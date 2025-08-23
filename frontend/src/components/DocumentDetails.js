import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getDocumentById, updateDocument, deleteDocument } from '../services/documentService';
import { io } from 'socket.io-client'
import { MessageCircle, X, Save, Trash2, Maximize2, Minimize2, Download } from 'lucide-react';

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
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
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
            // Only add message if it's not from the current user (to avoid duplicates)
            setChatMessages((prev) => {
                // Check if this message already exists (to prevent duplicates)
                const messageExists = prev.some(existingMsg => 
                    existingMsg.username === msg.username && 
                    existingMsg.message === msg.message && 
                    Math.abs(new Date(existingMsg.timestamp) - new Date(msg.timestamp)) < 1000
                );
                
                if (!messageExists && msg.username !== username) {
                    return [...prev, msg];
                }
                return prev;
            });
        });

        return () => socket.disconnect();
    }, [id, socket]);

    const handleUpdate = async () => {
        try {
            await updateDocument(id, { title, content });
            socket.emit('documentUpdate', { documentId: id, title, content });
            setSuccessMessage('Document updated successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch {
            setError('Failed to update document');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await deleteDocument(id);
                navigate('/dashboard');
            } catch {
                setError('Failed to delete document');
            }
        }
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        
        // Create message object
        const messageObj = {
            documentId: id,
            username,
            message: newMessage,
            timestamp: new Date().toISOString()
        };
        
        // Add message to local state immediately for the sender
        setChatMessages((prev) => [...prev, messageObj]);
        
        // Send to server
        socket.emit("sendMessage", messageObj);
        setNewMessage("");
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    // Download functions for DOCX and PDF only
    const downloadAsDocx = async () => {
        try {
            // This requires docx library: npm install docx
            const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');
            
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            text: title,
                            heading: HeadingLevel.TITLE,
                        }),
                        new Paragraph({
                            children: [new TextRun("")],
                        }),
                        ...content.split('\n').map(line => 
                            new Paragraph({
                                children: [new TextRun(line)],
                            })
                        ),
                    ],
                }],
            });

            const blob = await Packer.toBlob(doc);
            const url = window.URL.createObjectURL(blob);
            const element = document.createElement("a");
            element.href = url;
            element.download = `${title || 'document'}.docx`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('DOCX generation failed:', error);
            alert('Failed to generate DOCX file. Please make sure the required libraries are installed.');
        }
    };

    const downloadAsPdf = async () => {
        try {
            // This requires jsPDF library: npm install jspdf
            const { jsPDF } = await import('jspdf');
            
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 20;
            const maxLineWidth = pageWidth - 2 * margin;
            let yPosition = 30;

            // Add title
            doc.setFontSize(20);
            doc.setFont(undefined, 'bold');
            const titleLines = doc.splitTextToSize(title, maxLineWidth);
            doc.text(titleLines, margin, yPosition);
            yPosition += titleLines.length * 10 + 10;

            // Add content
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            const contentLines = doc.splitTextToSize(content, maxLineWidth);
            
            contentLines.forEach(line => {
                if (yPosition > doc.internal.pageSize.getHeight() - 20) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(line, margin, yPosition);
                yPosition += 7;
            });

            doc.save(`${title || 'document'}.pdf`);
        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('Failed to generate PDF file. Please make sure the required libraries are installed.');
        }
    };

    if (error) return <div className="alert alert-danger m-3">{error}</div>;
    if (!document) return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className={`${isFullscreen ? 'position-fixed top-0 start-0 w-100 h-100 bg-white' : 'min-vh-100'} d-flex`} 
             style={{ zIndex: isFullscreen ? 1050 : 'auto' }}>
            
            {/* Main Document Area */}
            <div className={`${isChatOpen ? 'flex-grow-1' : 'w-100'} d-flex flex-column`}>
                
                {/* Header Bar */}
                <div className="bg-light border-bottom p-3 d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 text-dark fw-bold">Document Editor</h4>
                    
                    {/* Success message */}
                    {message && <div className="alert alert-success mb-0 py-2">{message}</div>}
                    {successMessage && <div className="alert alert-success mb-0 py-2">{successMessage}</div>}
                    
                    <div className="d-flex gap-2">
                        {/* Download Dropdown */}
                        <div className="dropdown">
                            <button
                                className="btn btn-outline-success btn-sm rounded-pill dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                title="Download Document"
                            >
                                <Download size={16} className="me-1" />
                                Download
                            </button>
                            <ul className="dropdown-menu">
                                <li>
                                    <button 
                                        className="dropdown-item" 
                                        onClick={downloadAsDocx}
                                    >
                                        📄 Word Document (.docx)
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        className="dropdown-item" 
                                        onClick={downloadAsPdf}
                                    >
                                        📋 PDF Document (.pdf)
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <button
                            className="btn btn-outline-primary btn-sm rounded-pill"
                            onClick={handleUpdate}
                            title="Save Document"
                        >
                            <Save size={16} className="me-1" />
                            Save
                        </button>
                        <button
                            className="btn btn-outline-danger btn-sm rounded-pill"
                            onClick={handleDelete}
                            title="Delete Document"
                        >
                            <Trash2 size={16} />
                        </button>
                        <button
                            className="btn btn-outline-secondary btn-sm rounded-pill"
                            onClick={toggleFullscreen}
                            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                        >
                            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                        <button
                            className={`btn btn-sm rounded-pill ${isChatOpen ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setIsChatOpen(!isChatOpen)}
                            title="Toggle Chat"
                        >
                            <MessageCircle size={16} />
                        </button>
                    </div>
                </div>

                {/* Document Editing Area */}
                <div className="flex-grow-1 p-4 bg-white">
                    {/* Title input */}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control form-control-lg border-0 fw-bold fs-3"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                socket.emit('documentUpdate', { documentId: id, title: e.target.value, content });
                            }}
                            placeholder="Document Title"
                            style={{ outline: 'none', boxShadow: 'none' }}
                        />
                        <hr className="mt-2" />
                    </div>

                    {/* Content textarea */}
                    <div className="flex-grow-1">
                        <textarea
                            className="form-control border-0 h-100"
                            value={content}
                            onChange={(e) => {
                                setContent(e.target.value);
                                socket.emit('documentUpdate', { documentId: id, title, content: e.target.value });
                            }}
                            placeholder="Start writing your content here..."
                            style={{ 
                                minHeight: isFullscreen ? 'calc(100vh - 200px)' : '70vh',
                                resize: 'none',
                                outline: 'none',
                                boxShadow: 'none',
                                fontSize: '16px',
                                lineHeight: '1.6'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Chat Sidebar */}
            {isChatOpen && (
                <div className="border-start bg-light d-flex flex-column" 
                     style={{ width: '350px', minWidth: '300px' }}>
                    
                    {/* Chat Header */}
                    <div className="p-3 border-bottom bg-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 fw-semibold">Live Chat</h5>
                        <button
                            className="btn btn-sm btn-outline-secondary rounded-circle"
                            onClick={() => setIsChatOpen(false)}
                            style={{ width: '32px', height: '32px', padding: '0' }}
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-grow-1 p-3 overflow-auto" 
                         style={{ maxHeight: isFullscreen ? 'calc(100vh - 140px)' : '60vh' }}>
                        {chatMessages.length === 0 ? (
                            <div className="text-center text-muted py-4">
                                <MessageCircle size={48} className="mb-2 opacity-50" />
                                <p>No messages yet. Start the conversation!</p>
                            </div>
                        ) : (
                            chatMessages.map((msg, idx) => (
                                <div key={idx} className="mb-3 p-2 rounded-3 bg-white shadow-sm">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <strong className="text-primary small">{msg.username}</strong>
                                        <span className="text-muted small">
                                            {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                        </span>
                                    </div>
                                    <p className="mb-0 mt-1">{msg.message}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-3 border-top bg-white">
                        <div className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control rounded-pill"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type a message..."
                                style={{ fontSize: '14px' }}
                            />
                            <button
                                className="btn btn-primary rounded-circle"
                                onClick={handleSendMessage}
                                style={{ width: '40px', height: '40px', padding: '0' }}
                                disabled={!newMessage.trim()}
                            >
                                <span style={{ fontSize: '16px' }}>→</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentDetails;
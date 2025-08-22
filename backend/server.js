const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // MongoDB connection function
const authRoutes = require('./routes/auth'); // Authentication routes
const documentRoutes = require('./routes/documents'); // Document CRUD routes
const cors = require('cors');
const { Server } = require('socket.io'); // Import socket.io for real-time
const http = require('http'); // Needed to create HTTP server for socket.io

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
// Create HTTP server and bind Express app to it (required for socket.io)
const server = http.createServer(app);

// ✅ Configure CORS for API requests from React frontend
app.use(cors({
    origin: 'http://localhost:3000', // Only allow requests from frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

// ✅ Socket.io setup for real-time collaboration
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Allow frontend socket connections
        methods: ['GET', 'POST']
    }
});

// ✅ Middleware
app.use(express.json()); // Parse JSON bodies from requests

// ✅ API routes
app.use('/api/auth', authRoutes); // Routes for login/register
app.use('/api/documents', documentRoutes); // Routes for creating/editing documents

// ✅ Socket.io events (real-time communication)
io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    // Event when a user joins a document room
    socket.on('joinDocument', (documentId) => {
        socket.join(documentId); // Join a "room" based on documentId
        console.log(`User joined document ${documentId}`);
    });

    // Event when a document is updated → send update to other users in the same room
    socket.on('documentUpdate', ({ documentId, title, content }) => {
        socket.to(documentId).emit('receiveUpdate', { title, content });
    });

    // Event for chat messages within a document room
     socket.on("sendMessage", ({ documentId, username, message }) => {
        io.to(documentId).emit("receiveMessage", {
            username,
            message,
            timestamp: new Date()
        });
    });
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

// ✅ Start server on given port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

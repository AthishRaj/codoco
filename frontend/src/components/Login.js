// Import necessary React hooks and libraries
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation after login
import axios from 'axios'; // For making HTTP requests

const Login = () => {
    // State variables to store form input values and error messages
    const [email, setEmail] = useState('');       // Stores user's email input
    const [password, setPassword] = useState(''); // Stores user's password input
    const [error, setError] = useState('');       // Stores error messages (if login fails)

    const navigate = useNavigate(); // Used to navigate programmatically to other routes

    // Function to handle form submission
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevents default page refresh when form is submitted
        try {
            // Send POST request to backend login API with email and password
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });

            // Save user data (username + token) in localStorage for authentication persistence
            console.log(data.username); // Log username (for debugging)
            localStorage.setItem('user', JSON.stringify({ username: data.username, token: data.token }));

            // Navigate user to dashboard upon successful login
            navigate('/dashboard');
        } catch (error) {
            // If the backend returns an error (e.g., invalid credentials)
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message); // Show the error message from server
                navigate('/login'); // Stay on login page
            } else {
                // Handle unexpected errors (e.g., server down, network issue)
                setError('An unexpected error occurred. Please try again later.');
                navigate('/login');
            }
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            
            {/* Login form */}
            <form onSubmit={handleLogin}>
                {/* Email input field */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} // Update email state on input
                        required 
                    />
                </div>

                {/* Password input field */}
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} // Update password state on input
                        required 
                    />
                </div>

                {/* Submit button */}
                <button type="submit" className="btn btn-primary">Login</button>
            </form>

            {/* Show error message if login fails */}
            {error && <p className="text-danger mt-3">{error}</p>}

            {/* Redirect to registration if user doesn't have an account */}
            <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
    );
};

export default Login;

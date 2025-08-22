// Import React hooks and libraries
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation after registration
import axios from 'axios'; // For HTTP requests to backend

const Register = () => {
    // State variables to store form input values and error messages
    const [name, setName] = useState('');       // Stores entered username
    const [email, setEmail] = useState('');     // Stores entered email
    const [password, setPassword] = useState(''); // Stores entered password
    const [error, setError] = useState('');     // Stores error messages (if registration fails)

    const navigate = useNavigate(); // For redirecting user after successful registration

    // Function to handle form submission
    const handleRegister = async (e) => {
        e.preventDefault(); // Prevents page reload on form submit
        setError('');       // Clear any old error messages before new request

        try {
            // Send POST request to backend register API with name, email, and password
            const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });

            // Store token in localStorage (sent by backend after registration)
            localStorage.setItem('token', data.token);

            // Redirect to login page after successful registration
            navigate('/login');
        } catch (error) {
            // If backend returns a known error (like "email already exists")
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message); 
            } else {
                // Handle unexpected errors (like server down, network issue, etc.)
                setError('An unexpected error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>

            {/* Registration form */}
            <form onSubmit={handleRegister}>
                {/* Username field */}
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)} // Updates username state
                        required
                    />
                </div>

                {/* Email field */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Updates email state
                        required
                    />
                </div>

                {/* Password field */}
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Updates password state
                        required
                    />
                </div>

                {/* Submit button */}
                <button type="submit" className="btn btn-primary">Register</button>
            </form>

            {/* Show error message if registration fails */}
            {error && <p className="text-danger mt-3">{error}</p>}

            {/* Redirect to login if already registered */}
            <p>Already have an account? <a href="/">Login</a></p>
        </div>
    );
};

export default Register;

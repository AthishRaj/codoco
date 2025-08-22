import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify({ username: data.username, token: data.token }));
            navigate('/dashboard');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center vh-100"
            style={{
                background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" // lighter pastel gradient
            }}
        >
            <div className="p-5 bg-white rounded-4 shadow-lg text-center" style={{ maxWidth: "400px", width: "100%" }}>
                <h2 className="mb-4 text-primary">Login</h2>

                <form onSubmit={handleLogin}>
                    <div className="mb-3 text-start">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 shadow-sm">Login</button>
                </form>

                {error && <p className="text-danger mt-3">{error}</p>}

                <p className="mt-3">
                    Don't have an account? <a href="/register">Register</a>
                </p>
            </div>
        </div>
    );
};

export default Login;

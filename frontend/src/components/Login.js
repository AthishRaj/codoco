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
            className="d-flex align-items-center justify-content-center vh-100 px-3"
            style={{ background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" }}
        >
            <div
                className="p-5 bg-white shadow-lg text-center"
                style={{
                    maxWidth: "400px",
                    width: "100%",
                    borderRadius: "30px",
                }}
            >
                <h2 className="mb-4 fw-bold" style={{ color: "#2575fc" }}>Welcome Back</h2>

                <form onSubmit={handleLogin}>
                    <div className="mb-3 text-start">
                        <label htmlFor="email" className="form-label fw-semibold">Email address</label>
                        <input
                            type="email"
                            className="form-control rounded-pill shadow-sm px-3 py-2"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="mb-4 text-start">
                        <label htmlFor="password" className="form-label fw-semibold">Password</label>
                        <input
                            type="password"
                            className="form-control rounded-pill shadow-sm px-3 py-2"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn w-100 rounded-pill fw-bold"
                        style={{
                            backgroundColor: "#2575fc",
                            color: "#fff",
                            padding: "10px 0",
                            boxShadow: "0 4px 15px rgba(37, 117, 252, 0.3)",
                            transition: "all 0.3s ease"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                        Login
                    </button>
                </form>

                {error && <p className="text-danger mt-3">{error}</p>}

                <p className="mt-4 text-muted">
                    Don't have an account? <a href="/register" className="text-decoration-none fw-semibold" style={{ color: "#2575fc" }}>Register</a>
                </p>
            </div>
        </div>
    );
};

export default Login;

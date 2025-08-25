import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
            localStorage.setItem('token', data.token);
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        }
    };

    const validateEmail = (value) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(value);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (!validateEmail(value)) {
            setError("Please enter a valid email address");
        } else {
            setError("");
        }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center vh-100 px-3"
            style={{
                background: "linear-gradient(135deg,  #93fffaff 0%, #efacfdff  100%)"
            }}
        >
            <div
                className="p-5 bg-white shadow-lg text-center"
                style={{
                    maxWidth: "450px",
                    width: "100%",
                    borderRadius: "30px",
                }}
            >
                <h2 className="mb-4 fw-bold" style={{ color: "#2575fc" }}>Create Your Account</h2>

                <form onSubmit={handleRegister}>
                    <div className="mb-3 text-start">
                        <label htmlFor="name" className="form-label fw-semibold">Username</label>
                        <input
                            type="text"
                            className="form-control rounded-pill shadow-sm px-3 py-2"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className={`form-control rounded-pill shadow-sm px-3 py-2 form-control ${error ? "is-invalid" : ""}`}
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter your email"
                            required
                        />
                        {error && <div className="invalid-feedback">{error}</div>}
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
                        Register
                    </button>
                </form>

                {error && <p className="text-danger mt-3">{error}</p>}

                <p className="mt-4 text-muted">
                    Already have an account? <a href="/login" className="text-decoration-none fw-semibold" style={{ color: "#2575fc" }}>Login</a>
                </p>
            </div>
        </div>
    );
};

export default Register;

import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 px-3"
      style={{
        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
      }}
    >
      <div
        className="p-5 bg-white shadow-lg text-center"
        style={{
          maxWidth: "700px",
          width: "100%",
          borderRadius: "30px",
        }}
      >
        <h1 className="display-4 fw-bold mb-3">
          Welcome to <span style={{ color: '#2575fc' }}>Co</span>Doc
        </h1>

        <p className="lead text-muted mb-4" style={{ lineHeight: "1.6" }}>
          CoDoc is your go-to platform for <strong>seamless real-time collaboration</strong>.
          Work together on documents, share ideas, and chat effortlessly with your team.
        </p>

        <hr className="my-4" />

        <p className="text-secondary mb-4" style={{ lineHeight: "1.5" }}>
          Whether you're working on a <strong>team project</strong> or just need to
          <em> organize your thoughts</em>, CoDoc has everything you need to stay productive.
        </p>

        <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-4">
          <Link
            to="/register"
            className="btn btn-primary btn-lg w-100 w-md-auto shadow-sm"
            style={{
              borderRadius: "50px",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Register
          </Link>
          <Link
            to="/login"
            className="btn btn-outline-primary btn-lg w-100 w-md-auto shadow-sm"
            style={{
              borderRadius: "50px",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

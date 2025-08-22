import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" // lighter pastel gradient
      }}
    >
      <div className="p-5 bg-white rounded-4 shadow-lg text-center" style={{ maxWidth: "700px" }}>
        <h1 className="display-4 fw-bold mb-3 text-primary">
          Welcome to <span className="text-dark">CollabTool</span>
        </h1>

        <p className="lead text-muted mb-4">
          CollabTool is your go-to platform for <strong>seamless real-time collaboration</strong>.
          Work together on documents, share ideas, and chat effortlessly with your team.
        </p>

        <hr className="my-4" />

        <p className="text-secondary mb-4">
          Whether you're working on a <strong>team project</strong> or just need to
          <em> organize your thoughts</em>, CollabTool has everything you need to stay productive.
        </p>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <Link to="/register" className="btn btn-primary btn-lg px-4 shadow-sm">Register</Link>
          <Link to="/login" className="btn btn-outline-secondary btn-lg px-4 shadow-sm">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

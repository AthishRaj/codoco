import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="container text-center mt-5">
  <div className="p-5 bg-light rounded shadow-lg">
    <h1 className="display-4 fw-bold mb-3 text-primary">Welcome to CollabTool</h1>
    <p className="lead text-muted mb-4">
      CollabTool is your go-to platform for seamless real-time collaboration. 
      Work together on documents, share ideas, and communicate effortlessly with your team.
    </p>
    <hr className="my-4" />
    <p className="text-secondary mb-4">
      Whether you're working on a team project or just need to organize your thoughts, 
      CollabTool offers all the features you need to stay productive.
    </p>
    <div className="mt-4">
      <Link to="/register" className="btn btn-primary btn-lg px-4 me-3 shadow-sm">
        Register
      </Link>
      <Link to="/login" className="btn btn-outline-secondary btn-lg px-4 shadow-sm">
        Login
      </Link>
    </div>
  </div>
</div>

    );
};

export default LandingPage;

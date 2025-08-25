import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import img from '../assets/doc.svg'
// import { ArrowRight, User } from "lucide-react";



const LandingPage = () => {
  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "linear-gradient(135deg,  #93fffaff 0%, #efacfdff  100%)",
      }}
    >
      {/* Navbar */}
      <header className="d-flex justify-content-between align-items-center px-4 py-3">
        <motion.h2
          className="fw-bold m-0"
          style={{
            background:  "linear-gradient(90deg, #4b4b4bff, #002575ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span style={{
                background: "linear-gradient(90deg, #2575fc, #6a11cb)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",}}
                >Co</span>Doc
        </motion.h2>
        <nav className="d-none d-md-flex gap-4">
          <Link
            to="/register"
            className="fw-semibold text-dark text-decoration-none"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="fw-semibold text-dark text-decoration-none"
          >
            Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container text-center text-md-start flex-grow-1 d-flex align-items-center">
        <div className="row align-items-center">
          {/* Left Section */}
          <motion.div
            className="col-md-6"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              className="display-2 fw-bold mb-4"
              style={{
                background: "linear-gradient(90deg, #4b4b4bff, #002575ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Collaborate Smarter with <span className="display-2 fw-bold mb-4"
              style={{
                background: "linear-gradient(90deg, #2575fc, #6a11cb)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",}}
                >Co</span>Doc
            </h1>
            <p className="lead text-dark mb-4" style={{ lineHeight: "1.8" }}>
              Work together on documents, share ideas, and chat effortlessly
              with your team. <strong>Real-time collaboration</strong> has never
              been this smooth.
            </p>
            <p className="text-secondary mb-4" style={{ lineHeight: "1.6" }}>
              From <strong>team projects</strong> to <em>personal organization</em>,
              CoDoc gives you the tools to stay productive and connected.
            </p>

            <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
              <Link
                to="/register"
                className="btn btn-lg px-4 shadow"
                style={{
                  borderRadius: "50px",
                  background:
                    "linear-gradient(90deg, #2575fc, #6a11cb)",
                  color: "#fff",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "translateY(-4px)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="btn btn-outline-dark btn-lg px-4 shadow-sm"
                style={{
                  borderRadius: "50px",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "translateY(-4px)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                Login
              </Link>
            </div>
          </motion.div>

          {/* Right Section (Illustration / 3D icon) */}
          <motion.div
            className="col-md-6 mt-5 mt-md-0 text-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src={img}
              alt="Collaboration"
              className="img-fluid"
              style={{ maxHeight: "420px" }}
            />
          </motion.div>

        </div>
      </main>
    </div>
  );
};

export default LandingPage;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import DocumentForm from './components/DocumentForm';
import DocumentDetails from './components/DocumentDetails';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';

// Component to conditionally render Navbar
const ConditionalNavbar = () => {
    const location = useLocation();
    
    // Hide navbar on these routes
    const hideNavbarRoutes = ['/', '/login', '/register'];
    
    if (hideNavbarRoutes.includes(location.pathname)) {
        return null;
    }
    
    return <Navbar />;
};

function App() {
    return (
        <Router>
            <ConditionalNavbar />
            <Routes>
                <Route path="/" element={<LandingPage/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/document/:id" element={<DocumentDetails/>} />
                <Route path="/document/new" element={<DocumentForm />} />
            </Routes>
        </Router>
    );
}

export default App;
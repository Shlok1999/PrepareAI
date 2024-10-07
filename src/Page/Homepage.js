import React, { useState } from 'react';
import InfoForm from '../Component/InfoForm';
import '../Style/Homepage.css';

function Homepage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if user is logged in
    const [showDropdown, setShowDropdown] = useState(false); // For showing profile dropdown

    // Modal control
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Pseudo login function
    const handleLogin = () => {
        setIsLoggedIn(true); // Simulates logging in
    };

    // Toggle the dropdown for profile options
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    // Pseudo logout function
    const handleLogout = () => {
        setIsLoggedIn(false); // Simulates logging out
        setShowDropdown(false); // Hide the dropdown
    };

    return (
        <div className="main-container">
            {/* Top Right Login/Profile Button */}
            <div className="top-right-container">
                {!isLoggedIn ? (
                    <button className="login-button" onClick={handleLogin}>
                        Login
                    </button>
                ) : (
                    <div className="user-profile">
                        <img
                            src="https://www.w3schools.com/howto/img_avatar.png"
                            alt="user-logo"
                            className="user-logo"
                            onClick={toggleDropdown}
                        />
                        {showDropdown && (
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a href="/dashboard">Dashboard</a></li>
                                    <li><button onClick={handleLogout}>Signout</button></li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="content-container">
                <div className="text-container">
                    <h1 className="heading">Welcome to PrepareAI</h1>
                    <p className="subheading">
                        Sharpen your mind with the toughest questions designed for your success.
                    </p>
                    <button className="get-started-button" onClick={openModal}>
                        Get Started
                    </button>
                </div>
                <div className="animation-container">
                    {/* The animated gradient section */}
                </div>
            </div>
            <InfoForm isOpen={isModalOpen} onClose={closeModal} /> {/* Modal rendering */}
        </div>
    );
}

export default Homepage;

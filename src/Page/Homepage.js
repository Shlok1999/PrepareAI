import React, { useState, useEffect } from 'react';
import InfoForm from '../Component/InfoForm';
import LoginComponent from '../Component/AuthComponent/LoginComponent';
import { account } from '../appwrite/appwriteConfig';
import '../Style/Homepage.css';
import { Link } from 'react-router-dom';

function Homepage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // State for login modal
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if user is logged in
    const [showDropdown, setShowDropdown] = useState(false); // For showing profile dropdown
    const [user,setUser] = useState(null);//Store User data after login

    // Modal control for InfoForm
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Modal control for login
    const openLoginModal = () => {
        setIsLoginModalOpen(true);
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    // Pseudo login function
    const handleLogin =async () => {
        try {
            const userData = await account.get(); 
            setUser(userData);
            setIsLoggedIn(true);
            closeLoginModal();
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        const getUserData = async () => {
            try {
                const userData = await account.get(); // Fetch user data from Appwrite session
                setUser(userData);
                setIsLoggedIn(true);
            } catch (error) {
                console.error('No session found:', error);
            }
        };

        getUserData();
    }, []);

    console.log(isLoggedIn)

    const handleLogout = async () => {
        try {
            await account.deleteSession('current'); // End user session
            setIsLoggedIn(false); // Simulate logging out
            setUser(null); // Clear user data
            setShowDropdown(false); // Hide dropdown
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // Toggle the dropdown for profile options
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    // Pseudo logout function
    

    return (
        <div className="main-container">
            {/* Top Right Login/Profile Button */}
            <div className="top-right-container">
                {!isLoggedIn ? (
                    <button className="login-button" onClick={openLoginModal}>
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
                    <button className="get-started-button">
                        {
                            isLoggedIn?
                            <div>
                                <Link style={{textDecoration: 'none', color: 'white'}} to={'/dashboard'}>Go To Dashboard</Link>
                            </div>
                            :<div>
                                <p onClick={openLoginModal}>Login</p>
                            </div>
                        }
                    </button>
                </div>
                <div className="animation-container">
                    {/* The animated gradient section */}
                </div>
            </div>

            <InfoForm isOpen={isModalOpen} onClose={closeModal} /> {/* InfoForm modal rendering */}
            {isLoginModalOpen && <LoginComponent onClose={closeLoginModal} handleLogin={handleLogin} />} {/* Login modal rendering */}
        </div>
    );
}

export default Homepage;

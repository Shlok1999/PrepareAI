import React, { useEffect, useState } from "react";
import { BookOpen, Menu, X } from "lucide-react";
import { LoginModal } from "../HomeComponents/LoginModal";
import { useNavigate } from "react-router-dom";
import { account } from "../../appwrite/appwriteConfig"; // Import Appwrite account configuration
import { Power } from "lucide-react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await account.deleteSession("current"); // Delete the current Appwrite session
            sessionStorage.clear(); // Clear local session storage
            navigate("/"); // Redirect to login page
        } catch (err) {
            console.error("Error during logout:", err);
        }
    };


    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const user = await account.get(); // Check if the user session exists
                setUserProfile(user); // Store user profile in state
            } catch (error) {
                console.error("No active session:", error);
                setUserProfile(null); // Reset the profile if no session exists
            }
        };

        checkUserSession();
    }, []);

    return (
        <>
            {/* Navbar */}
            <nav className="bg-white shadow-md fixed w-full z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <BookOpen className="h-8 w-8 text-indigo-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">PrepareAI</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-700 hover:text-indigo-600">
                                Features
                            </a>
                            <a href="#subjects" className="text-gray-700 hover:text-indigo-600">
                                Subjects
                            </a>
                            <a href="#testimonials" className="text-gray-700 hover:text-indigo-600">
                                Testimonials
                            </a>

                            {userProfile ? (
                                <>
                                <button
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    Dashboard
                                </button>
                                <Power onClick={handleLogout} className="h-5 w-5 mr-3 text-red-500" />

                                </>
                            ) : (
                                <button
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                    onClick={() => setIsLoginModalOpen(true)}
                                >
                                    Get Started
                                </button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                            
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <a
                                href="#features"
                                className="block px-3 py-2 text-gray-700 hover:text-indigo-600"
                            >
                                Features
                            </a>
                            <a
                                href="#subjects"
                                className="block px-3 py-2 text-gray-700 hover:text-indigo-600"
                            >
                                Subjects
                            </a>
                            <a
                                href="#testimonials"
                                className="block px-3 py-2 text-gray-700 hover:text-indigo-600"
                            >
                                Testimonials
                            </a>

                            {userProfile ? (
                                <>
                                <button
                                    className="w-full text-left px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        navigate("/dashboard");
                                    }}
                                >
                                    Dashboard
                                </button>
                                <a
                                    className="block px-3 py-2 text-gray-700 hover:text-indigo-600"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        navigate("/dashboard");
                                    }}
                                >
                                   <Power onClick={handleLogout} className="h-5 w-5 mr-3 text-red-500" />
                                </a>

                                
                                </>
                                
                            ) : (
                                <button
                                    className="w-full text-left px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setIsLoginModalOpen(true);
                                    }}
                                >
                                    Get Started
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Login Modal */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </>
    );
}

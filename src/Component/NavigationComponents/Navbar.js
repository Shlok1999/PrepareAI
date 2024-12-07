import React, { useState, useEffect } from 'react';
import { BookOpen, Menu, X } from 'lucide-react';
import { LoginModal } from '../HomeComponents/LoginModal';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null)

    useEffect(() => {
        const fetchUserProfile = () => {
            const profile = JSON.parse(sessionStorage.getItem("profile"));
            setUserProfile(profile);
        };
        fetchUserProfile();
    },
        []);

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
                            <a href="#features" className="text-gray-700 hover:text-indigo-600">Features</a>
                            <a href="#subjects" className="text-gray-700 hover:text-indigo-600">Subjects</a>
                            <a href="#testimonials" className="text-gray-700 hover:text-indigo-600">Testimonials</a>

                            {
                                userProfile?<>
                                    {userProfile.picture}
                                </>:<>
                                 <button
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                onClick={() => setIsLoginModalOpen(true)}
                            >
                                Get Started
                            </button>
                                </>
                            }
                           
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
                            <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Features</a>
                            <a href="#subjects" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Subjects</a>
                            <a href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Testimonials</a>
                            <button
                                className="w-full text-left px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    setIsLoginModalOpen(true);
                                }}
                            >
                                Get Started
                            </button>
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

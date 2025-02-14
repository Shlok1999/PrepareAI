import React, { useEffect, useState } from "react";
import { BookOpen, Menu, X, Power } from "lucide-react";
import { LoginModal } from "../HomeComponents/LoginModal";
import { useNavigate } from "react-router-dom";
import { account } from "../../appwrite/appwriteConfig";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true); // Show loader
    try {
      await account.deleteSession("current"); // Delete the current Appwrite session
      sessionStorage.clear(); // Clear local session storage
      setUserProfile(null); // Reset the user profile in state
      navigate("/"); // Redirect to the homepage
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const user = await account.get(); // Check if the user session exists
        setUserProfile(user); // Store user profile in state
        navigate("/dashboard"); // Navigate to dashboard if user is logged in
      } catch (error) {
        console.error("No active session:", error);
        setUserProfile(null); // Reset the profile if no session exists
      }
    };
  
    checkUserSession();
  }, [navigate]); // Add navigate as a dependency

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              {/* <BookOpen className="h-8 w-8 text-indigo-600" /> */}
              <img src="/prepare-ai.png" alt="PrepareAI" className="h-10 w-10" />
              <span className="ml-2 text-xl font-bold text-gray-900">PrepareAI</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-indigo-600">
                Features
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-indigo-600">
                Pricing
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
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Power className="h-5 w-5 mr-1" />
                    Logout
                  </button>
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
              <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">
                Features
              </a>
              <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">
                Pricing
              </a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">
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
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Power className="h-5 w-5 mr-1" />
                    Logout
                  </button>
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

      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="loader border-t-4 border-indigo-600 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}

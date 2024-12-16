import React, { useEffect, useState } from 'react';
import { Brain, Target, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { account } from '../../appwrite/appwriteConfig';
import { LoginModal } from './LoginModal';

export function Hero() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

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

  const handleButtonClick = () => {
    if (userProfile) {
      // If user is logged in, navigate to dashboard
      navigate('/dashboard');
    } else {
      // If not logged in, open login modal
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <div className="pt-20 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-8 lg:mb-0">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Ace Your <span className="text-indigo-600">IIT-JEE</span> and <span className="text-indigo-600">NEET</span> with AI
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Create personalized test series, get AI-powered feedback, and track your progress with advanced analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={handleButtonClick}
                >
                  {userProfile ? "Dashboard" : "Get Started"}
                </button>
                <button className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <Brain className="h-8 w-8 text-indigo-600 mb-4" />
                <h3 className="font-semibold mb-2">AI-Powered Learning</h3>
                <p className="text-gray-600">Personalized feedback and recommendations</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <Target className="h-8 w-8 text-indigo-600 mb-4" />
                <h3 className="font-semibold mb-2">Custom Tests</h3>
                <p className="text-gray-600">Create your own test series</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg col-span-2">
                <BookOpen className="h-8 w-8 text-indigo-600 mb-4" />
                <h3 className="font-semibold mb-2">Comprehensive Coverage</h3>
                <p className="text-gray-600">Complete syllabus for IIT-JEE and NEET</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}

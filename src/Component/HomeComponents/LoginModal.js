import React, { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Building2 } from "lucide-react";
import { account } from "../../appwrite/appwriteConfig"; // Import Appwrite account configuration

export function LoginModal({ isOpen, onClose }) {
  const [errorMessage, setErrorMessage] = useState(""); // Error message for Appwrite login
  const [email, setEmail] = useState(""); // Appwrite email input
  const [password, setPassword] = useState(""); // Appwrite password input

  const navigate = useNavigate();

  // Google Login Setup
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      sessionStorage.setItem("user", JSON.stringify(codeResponse));
      fetchUserProfile(codeResponse.access_token);
    },
    onError: (error) => console.log("Google Login Failed:", error),
  });

  const fetchUserProfile = async (accessToken) => {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );
      sessionStorage.setItem("profile", JSON.stringify(res.data));
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } catch (err) {
      console.error("Error fetching Google user profile:", err);
    }
  };

  // Appwrite Login
  const handleAppwriteLogin = async (e) => {
    e.preventDefault();
    try {
      // Attempt to log in the user via Appwrite
      await account.createEmailPasswordSession(email, password);
      const profile = await account.get(); // Fetch user profile
      sessionStorage.setItem("profile", JSON.stringify(profile));
      onClose(); // Close the modal on successful login
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      setErrorMessage("Login failed. Please check your credentials.");
      console.error("Login Error:", error);
    }
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      fetchUserProfile(JSON.parse(storedUser).access_token);
    }
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome to PrepareAI</h2>
        <p className="text-gray-600 mt-2">Choose how you want to continue</p>
      </div>

      {/* Login Options */}
      <div className="space-y-4">
        {/* Google Login */}
        <button
          className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={login}
        >
          <GraduationCap className="h-6 w-6" />
          <span className="font-semibold">Login with Google</span>
        </button>

        {/* Appwrite Login */}
        <form onSubmit={handleAppwriteLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Login 
          </button>
        </form>

        {errorMessage && (
          <p className="text-sm text-red-500 text-center mt-2">{errorMessage}</p>
        )}
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{" "}
        <button
          className="text-indigo-600 font-semibold hover:text-indigo-800"
          onClick={() => navigate('/register')}
        >
          Sign up now
        </button>
      </p>
    </Modal>
  );
}

import React, { useState } from "react";
import { Modal } from "./Modal";
import { useNavigate } from "react-router-dom";
import { account } from "../../appwrite/appwriteConfig"; // Import Appwrite account configuration

export function LoginModal({ isOpen, onClose }) {
  const [errorMessage, setErrorMessage] = useState(""); // Error message for Appwrite login
  const [email, setEmail] = useState(""); // Appwrite email input
  const [password, setPassword] = useState(""); // Appwrite password input

  const navigate = useNavigate();

  // Appwrite Login
  const handleAppwriteLogin = async (e) => {
    e.preventDefault();
    try {
      // Attempt to log in the user via Appwrite
      await account.createEmailPasswordSession(email, password);
      const profile = await account.get(); // Fetch user profile
      console.log(profile)
      sessionStorage.setItem("profile", JSON.stringify(profile));
      onClose(); // Close the modal on successful login
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      setErrorMessage("Login failed. Please check your credentials.");
      console.error("Login Error:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome to PrepareAI</h2>
        <p className="text-gray-600 mt-2">Please login to continue</p>
      </div>

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

      {/* Footer */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{" "}
        <button
          className="text-indigo-600 font-semibold hover:text-indigo-800"
          onClick={() => navigate("/register")}
        >
          Sign up now
        </button>
      </p>
    </Modal>
  );
}

import React, { useState } from "react";
import { Modal } from "./Modal";
import { useNavigate } from "react-router-dom";
import { account } from "../../appwrite/appwriteConfig";

export function LoginModal({ isOpen, onClose }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(""); // Clear errors on input change
  };

  // Handle Appwrite Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Log in the user via Appwrite
      await account.createEmailPasswordSession(credentials.email, credentials.password);
      const profile = await account.get(); // Fetch the logged-in user's profile

      // Save profile to sessionStorage for client-side state management
      sessionStorage.setItem("profile", JSON.stringify(profile));

      onClose(); // Close modal after successful login
      window.location.href = "/dashboard" // Redirect to dashboard
    } catch (error) {
      setErrorMessage("Invalid email or password. Please try again.");
      console.error("Login Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome to PrepareAI</h2>
        <p className="text-gray-600 mt-2">Please log in to continue</p>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center mb-4">
          <div className="loader border-t-indigo-500 animate-spin rounded-full w-8 h-8"></div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {errorMessage && (
          <p className="text-sm text-red-500 text-center">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-4 text-white rounded-lg transition-colors ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

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

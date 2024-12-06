import React, { useState } from 'react';
import { Modal } from '../HomeComponents/Modal'; // Import the Modal component
import { account } from '../../appwrite/appwriteConfig';

function LoginComponent({ isOpen, onClose, handleLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Attempt to log in the user via Appwrite
      await account.createEmailPasswordSession(email, password);
      handleLogin(); // If successful, mark as logged in
      onClose(); // Close the modal on successful login
    } catch (error) {
      setErrorMessage('Login failed. Please check your credentials.');
      alert(errorMessage);
      console.error('Error logging in:', error);
    }
  };

  

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Login</h2>
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-4 text-sm text-center text-gray-600">
          Not Registered?{' '}
          <a
            href="/register"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Register
          </a>
        </p>
      </div>
    </Modal>
  );
}

export default LoginComponent;

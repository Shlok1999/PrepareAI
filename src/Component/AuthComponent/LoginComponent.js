import React, { useState } from 'react';
import '../../Style/LoginComponent.css'; // Create a corresponding CSS file for styling
import { account } from '../../appwrite/appwriteConfig';

function LoginComponent({ onClose, handleLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            // Attempt to log in the user via Appwrite
            await account.createEmailPasswordSession(email, password);
            handleLogin(); // If successful, mark as logged in
        } catch (error) {
            setErrorMessage('Login failed. Please check your credentials.');
            alert(errorMessage)
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            placeholder='Email'
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            placeholder='Password'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        Login
                    </button>
                </form>
                <p className="register-text">
                    Not Registered? <a href="/register">Register</a>
                </p>
            </div>
        </div>
    );
}

export default LoginComponent;

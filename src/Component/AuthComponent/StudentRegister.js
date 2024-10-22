import React, { useState } from 'react';
import { account } from '../../appwrite/appwriteConfig';
import '../../Style/Registration.css'; // Create a corresponding CSS file for styling

function StudentRegister() {
    // State for form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [classLevel, setClassLevel] = useState('11'); // Default class is 11
    const [exam, setExam] = useState('IIT-JEE'); // Default exam is IIT-JEE
    const [parentPhone, setParentPhone] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // State to manage loading


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // Create a new user account in Appwrite
            const userResponse = await account.create(
                'unique()', // Unique ID for the user
                email,
                password,
                name
            );

            // You can optionally save additional user data in Appwrite's database (for example, class, exam, parent details)

            setSuccessMessage('Registration successful!');
        } catch (error) {
            setErrorMessage('Registration failed. Please try again.');
            console.error('Error registering user:', error);
        }
        finally{
            setIsLoading(false);
            window.location.reload();
        }
    };

    return (
        <div className="register-container">
            {isLoading && (
                <div className="loader-overlay">
                    <div className="loader"></div>
                </div>
            )}
            <h2>Student Registration</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Class</label>
                    <select
                        value={classLevel}
                        onChange={(e) => setClassLevel(e.target.value)}
                    >
                        <option value="11">11th</option>
                        <option value="12">12th</option>
                        <option value="repeater">Repeater</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Select Exam</label>
                    <select
                        value={exam}
                        onChange={(e) => setExam(e.target.value)}
                    >
                        <option value="IIT-JEE">IIT-JEE</option>
                        <option value="NEET">NEET</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Parent's Phone (Optional)</label>
                    <input
                        type="tel"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label>Parent's Email (Optional)</label>
                    <input
                        type="email"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                    />
                </div>
                <button type="submit" className="submit-button">
                    Register
                </button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
        </div>
    );
}

export default StudentRegister;

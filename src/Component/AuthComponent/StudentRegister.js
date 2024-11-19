import React, { useState } from 'react';
import { account, databases } from '../../appwrite/appwriteConfig';
import '../../Style/Registration.css'; // Create a corresponding CSS file for styling

function StudentRegister() {
    // State for form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [classLevel, setClassLevel] = useState('11'); // Default class is 11
    const [exam, setExam] = useState('IIT-JEE'); // Default exam is IIT-JEE
    const [examYear,setExamYear] = useState(2024);
    const [parent_phone, setParentPhone] = useState('');
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
            setSuccessMessage('Registration successful! User created.');
    
            // Save additional user data in Appwrite's database
            try {
                const userInDb = await databases.createDocument(
                    process.env.REACT_APP_DATABASE_ID,
                    process.env.REACT_APP_STUDENT_COLL_ID,
                    'unique()', // Unique document ID
                    {
                        name: name,
                        email: email,
                        password: password,
                        phone: phone,
                        classLevel: classLevel,
                        exam: exam,
                        exam_year: examYear,
                        parent_phone: parent_phone,

                    }
                );
    
                if (userInDb) {
                    console.log("Student added to DB:", userInDb);
                    setSuccessMessage('Student data saved successfully!');
                }
            } catch (dbError) {
                setErrorMessage('Failed to save student in the database.');
                console.error('Database error:', dbError);
            }
        } catch (error) {
            setErrorMessage('Registration failed. Please try again.');
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
            // Optionally reload page or redirect user after successful registration
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
                    <label>Exam Year</label>
                    <select
                        value={exam}
                        onChange={(e) => setExamYear(e.target.value)}
                    >
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Parent's Phone (Optional)</label>
                    <input
                        type="tel"
                        value={parent_phone}
                        onChange={(e) => setParentPhone(e.target.value)}
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

import React, { useState, useEffect } from 'react';
import { account, databases } from '../../appwrite/appwriteConfig'; // Import Appwrite configuration
import { Query } from 'appwrite';
import '../../Style/ProfileSettings.css'; // Create a corresponding CSS file for styling

function ProfileSettings() {
    const [studentData, setStudentData] = useState(null); // State to store student data
    const [isLoading, setIsLoading] = useState(true); // Loader state
    const [error, setError] = useState(null); // Error handling state

    const databaseId = process.env.REACT_APP_DATABASE_ID; // Your Appwrite Database ID
    const collectionId = process.env.REACT_APP_STUDENT_COLL_ID; // Your Student Collection ID

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                // Step 1: Get logged-in user info
                const user = await account.get();
                const userEmail = user.email;
                console.log(userEmail)

                // Step 2: Query the student collection by the user's email
                const response = await databases.listDocuments(databaseId, collectionId, [
                    Query.equal('email', userEmail)
                ]);

                if (response.documents.length > 0) {
                    setStudentData(response.documents[0]);
                } else {
                    setError("No student data found for this user.");
                }
            } catch (error) {
                console.error('Error fetching student data:', error);
                setError("Failed to fetch student data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudentData();
    }, [databaseId, collectionId]);

    if (isLoading) {
        return (
            <div className="loader-container">
                <div className="animated-card-loader"></div> {/* Animated card loader */}
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="profile-card-container">
            <div className="profile-card">
                <h2>My Profile</h2>
                <div className="profile-info">
                    <p><strong>Name:</strong> {studentData?.name}</p>
                    <p><strong>Email:</strong> {studentData?.email}</p>
                    <p><strong>Phone:</strong> {studentData?.phone}</p>
                    <p><strong>Class:</strong> {studentData?.classLevel}</p>
                    <p><strong>Exam:</strong> {studentData?.exam}</p>
                     <p><strong>Parent's Phone:</strong> {studentData?.parentPhone}</p>
                     <p><strong>Parent's Email:</strong> {studentData?.parentEmail}</p>
                </div>
            </div>
        </div>
    );
}

export default ProfileSettings;

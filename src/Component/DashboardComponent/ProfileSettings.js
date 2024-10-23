import React, { useState, useEffect } from 'react';
import { account } from '../../appwrite/appwriteConfig'; // Import Appwrite configuration
import '../../Style/ProfileSettings.css'; // Create a corresponding CSS file for styling

function ProfileSettings() {
    const [user, setUser] = useState(null); // State to store user data
    const [isLoading, setIsLoading] = useState(true); // Loader state

    useEffect(() => {
        // Fetch user data from Appwrite on component mount
        const fetchUserData = async () => {
            try {
                const userData = await account.get(); // Get user data from Appwrite
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false); // Stop loading once data is fetched
            }
        };

        fetchUserData();
    }, []);

    if (isLoading) {
        return (
            <div className="loader-container">
                <div className="card-loader"></div> {/* Loader animation */}
            </div>
        );
    }

    return (
        <div className="profile-card-container">
            <div className="profile-card">
                <h2>User Profile</h2>
                <div className="profile-info">
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Phone:</strong> {user?.phone}</p>
                    <p><strong>Class:</strong> {user?.prefs?.classLevel}</p>
                    <p><strong>Exam:</strong> {user?.prefs?.exam}</p>
                    {user?.prefs?.parentPhone && <p><strong>Parent's Phone:</strong> {user?.prefs?.parentPhone}</p>}
                    {user?.prefs?.parentEmail && <p><strong>Parent's Email:</strong> {user?.prefs?.parentEmail}</p>}
                </div>
            </div>
        </div>
    );
}

export default ProfileSettings;

import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin, School } from "lucide-react";
import { account, databases } from "../../appwrite/appwriteConfig"; // Import Appwrite config
import { Query } from 'appwrite';

function ProfileHeader() {
  const [studentData, setStudentData] = useState(null); // Student data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const databaseId = process.env.REACT_APP_DATABASE_ID; // Appwrite database ID
  const collectionId = process.env.REACT_APP_STUDENT_COLL_ID; // Student collection ID

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Step 1: Get logged-in user info
        const user = await account.get();
        const userEmail = user.email;

        // Step 2: Query the student collection by the user's email
        const response = await databases.listDocuments(databaseId, collectionId, [
          Query.equal("email", userEmail),
        ]);

        if (response.documents.length > 0) {
          setStudentData(response.documents[0]);
        } else {
          setError("No student data found for this user.");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        setError("Failed to fetch student data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [databaseId, collectionId]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <p className="text-gray-500">Loading student profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src={studentData.avatarUrl || "https://via.placeholder.com/150"} // Default avatar
          alt={studentData.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-indigo-50"
        />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{studentData.name}</h2>
          <div className="space-y-2 text-gray-600">
            <div className="flex items-center justify-center md:justify-start">
              <Mail className="h-4 w-4 mr-2" />
              <span>{studentData.email}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <Phone className="h-4 w-4 mr-2" />
              <span>{studentData.phone || "Not provided"}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{studentData.location || "Not provided"}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <School className="h-4 w-4 mr-2" />
              <span>{studentData.school || "Not provided"}</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default ProfileHeader;

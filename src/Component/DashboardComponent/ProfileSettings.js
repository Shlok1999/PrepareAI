import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, School, BookOpen, Clock, Trophy } from "lucide-react";
import { account, databases } from "../../appwrite/appwriteConfig"; // Import Appwrite configuration
import { Query } from "appwrite";

function ProfileSettings() {
  const [studentData, setStudentData] = useState(null); // State to store student data
  const [isLoading, setIsLoading] = useState(true); // Loader state
  const [error, setError] = useState(null); // Error handling state

  const databaseId = process.env.REACT_APP_DATABASE_ID; // Appwrite Database ID
  const collectionId = process.env.REACT_APP_STUDENT_COLL_ID; // Appwrite Student Collection ID

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
        <p className="text-gray-500">Loading profile...</p>
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
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      {/* Profile Information Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src={studentData.avatarUrl || "https://via.placeholder.com/150"}
          alt={studentData.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-indigo-50"
        />
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{studentData.name}</h2>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-center justify-center md:justify-start">
              <Mail className="h-5 w-5 mr-2 text-gray-500" />
              <span>{studentData.email}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <Phone className="h-5 w-5 mr-2 text-gray-500" />
              <span>{studentData.phone || "Not provided"}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <MapPin className="h-5 w-5 mr-2 text-gray-500" />
              <span>{studentData.location || "Not provided"}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <School className="h-5 w-5 mr-2 text-gray-500" />
              <span>{studentData.school || "Not provided"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-indigo-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Target Examination</p>
                <p className="font-medium">{studentData.exam}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-indigo-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Exam Year</p>
                <p className="font-medium">{studentData.exam_year}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Trophy className="h-5 w-5 text-indigo-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Mock Tests Taken</p>
                <p className="font-medium">{studentData.mockTests || "Not provided"}</p>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Strong Subjects</h4>
              <div className="flex flex-wrap gap-2">
                {studentData.strongSubjects && studentData.strongSubjects.length > 0 ? (
                  studentData.strongSubjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm"
                    >
                      {subject}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">Not provided</span>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Areas for Improvement</h4>
              <div className="flex flex-wrap gap-2">
                {studentData.weakSubjects && studentData.weakSubjects.length > 0 ? (
                  studentData.weakSubjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm"
                    >
                      {subject}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">Not provided</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;

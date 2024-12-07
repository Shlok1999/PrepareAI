import React, { useEffect, useState } from "react";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { AcademicInfo } from "../../components/profile/AcademicInfo";
import { account, databases } from "../../appwrite/appwriteConfig";
import { Query } from "appwrite";

export function ProfilePage() {
  const [studentData, setStudentData] = useState(null);
  const [academicData, setAcademicData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const databaseId = process.env.REACT_APP_DATABASE_ID; // Replace with your Appwrite Database ID
  const studentCollectionId = process.env.REACT_APP_STUDENT_COLL_ID; // Replace with your Student Collection ID

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Step 1: Get logged-in user info
        const user = await account.get();
        const userEmail = user.email;

        // Step 2: Query the student collection
        const studentResponse = await databases.listDocuments(databaseId, studentCollectionId, [
          Query.equal("email", userEmail),
        ]);

        if (studentResponse.documents.length > 0) {
          setStudentData(studentResponse.documents[0]);
        } else {
          throw new Error("No student profile data found.");
        }

        // Step 3: Query the academic collection (optional)
        const academicResponse = await databases.listDocuments(databaseId, academicCollectionId, [
          Query.equal("email", userEmail),
        ]);

        // if (academicResponse.documents.length > 0) {
        //   setAcademicData(academicResponse.documents[0]);
        // } else {
        //   throw new Error("No academic data found.");
        // }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to fetch profile data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [databaseId, studentCollectionId, academicCollectionId]);

  if (isLoading) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Profile</h1>
      {studentData && <ProfileHeader student={studentData} />}
      {academicData && <AcademicInfo academics={academicData} />}
    </div>
  );
}

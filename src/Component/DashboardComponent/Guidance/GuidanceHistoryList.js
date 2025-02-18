import React, { useEffect, useState } from "react";
import { account, databases } from "../../../appwrite/appwriteConfig";
import { Query } from "appwrite";

const GuidanceHistoryList = () => {
  const daily_test_coll = process.env.REACT_APP_DAILY_TEST_COLLECTION;
  const dbId = process.env.REACT_APP_DATABASE_ID;

  const [studentId, setStudentId] = useState(null);
  const [guidanceHistory, setGuidanceHistory] = useState([]);

  // Fetch student ID when component mounts
  useEffect(() => {
    const fetchStudentId = async () => {
      try {
        const user = await account.get();
        setStudentId(user.$id);
      } catch (error) {
        console.error("Error fetching student ID:", error);
      }
    };
    fetchStudentId();
  }, []);

  // Fetch guidance history when studentId is available
  useEffect(() => {
    if (!studentId) return; // Ensure studentId is available before fetching

    const getGuidanceHistory = async () => {
      try {
        const response = await databases.listDocuments(dbId, daily_test_coll, [
          Query.equal("student_id", studentId),
        ]);
        setGuidanceHistory(response.documents);
        console.log(response.documents);
      } catch (error) {
        console.error("Error fetching guidance history:", error);
      }
    };

    getGuidanceHistory();
  }, [studentId]); // Runs when studentId changes

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        📚 Guidance History
      </h1>

      {guidanceHistory.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guidanceHistory.map((test) => (
            <div
              key={test.$id}
              className="bg-white p-5 shadow-lg rounded-xl border border-gray-200 hover:shadow-2xl transition duration-300"
            >
              <h2 className="text-lg font-semibold text-gray-700">
                {test.subject}
              </h2>
              <p className="text-gray-500 mt-2">
                <span className="font-medium text-gray-600">Score:</span>{" "}
                {test.marks}/80 {test.Updated}
              </p>
              <div className="mt-4">
                <button
                  className="w-full text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium transition"
                  onClick={() => alert(`Viewing details for ${test.subject}`)}
                >
                  🔍 View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg mt-10">
          No test history available.
        </p>
      )}
    </div>
  );
};

export default GuidanceHistoryList;

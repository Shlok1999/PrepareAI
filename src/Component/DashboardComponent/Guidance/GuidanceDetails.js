import React, { useEffect, useState } from "react";
import { account, databases } from "../../../appwrite/appwriteConfig";
import { Query } from "appwrite";

const API_BASE_URL = "http://localhost:5000/student/guidance"; // Replace with your Node.js API URL

const GuidanceDetails = () => {
  const daily_test_coll = process.env.REACT_APP_DAILY_TEST_COLLECTION;
  const dbId = process.env.REACT_APP_DATABASE_ID;

  const [studentId, setStudentId] = useState(null);
  const [guidanceHistory, setGuidanceHistory] = useState([]);
  const [testDetails, setTestDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    if (!studentId) return;

    const getGuidanceHistory = async () => {
      try {
        const response = await databases.listDocuments(dbId, daily_test_coll, [
          Query.equal("student_id", studentId),
        ]);
        setGuidanceHistory(response.documents);
      } catch (error) {
        console.error("Error fetching guidance history:", error);
      }
    };

    getGuidanceHistory();
  }, [studentId]);

  // Fetch test details from Node.js backend
  const fetchTestDetails = async (testId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/test-details/${testId}`);
      const data = await response.json();
      setTestDetails(data);
      setShowModal(true); // Show modal with test details
    } catch (error) {
      console.error("Error fetching test details:", error);
    }
  };

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
                {test.marks}/80
              </p>
              <div className="mt-4">
                <button
                  className="w-full text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium transition"
                  onClick={() => fetchTestDetails(test.$id)}
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

      {/* MODAL FOR TEST DETAILS */}
      {showModal && testDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {testDetails.subject} - Test Details
            </h2>
            <p className="text-gray-600">
              <strong>Score:</strong> {testDetails.marks}/80
            </p>
            <p className="text-gray-600">
              <strong>Date:</strong> {testDetails.date}
            </p>
            <p className="text-gray-600">
              <strong>Feedback:</strong> {testDetails.feedback}
            </p>
            <button
              className="mt-4 w-full text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition"
              onClick={() => setShowModal(false)}
            >
              ❌ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidanceDetails;

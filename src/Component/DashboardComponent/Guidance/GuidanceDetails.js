import React, { useEffect, useState } from "react";
import { account, databases } from "../../../appwrite/appwriteConfig";
import { Query } from "appwrite";

const API_BASE_URL = "http://localhost:5000/student/guidance"; // Replace with your actual API URL

const GuidanceDetails = () => {
  const daily_test_coll = process.env.REACT_APP_DAILY_TEST_COLLECTION;
  const dbId = process.env.REACT_APP_DATABASE_ID;

  const [studentId, setStudentId] = useState(null);
  const [guidanceHistory, setGuidanceHistory] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Fetch student ID when the component mounts
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

  // Function to fetch AI-generated guidance from the backend
  const getGuidance = async (testId, quizData) => {
    setLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch(`${API_BASE_URL}/${testId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData),
      });

      const data = await response.json();
      if (response.ok) {
        setAnalysis(data);
        setShowModal(true);
      } else {
        console.error("Error in AI analysis:", data.error);
      }
    } catch (error) {
      console.error("Error fetching AI guidance:", error);
    } finally {
      setLoading(false);
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
              <div className="mt-4 flex flex-col gap-3">
                <button
                  className="w-full text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium transition"
                  onClick={() => getGuidance(test.$id, test)}
                >
                  📊 Get Guidance
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

      {/* MODAL FOR GUIDANCE DETAILS */}
      {showModal && analysis && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              📌 AI Guidance Report
            </h2>

            <p className="text-gray-600">
              <strong>Accuracy:</strong> {analysis.overallPerformance.accuracy}%
            </p>
            <p className="text-gray-600">
              <strong>Correct Answers:</strong> {analysis.overallPerformance.correctAnswers}
            </p>
            <p className="text-gray-600">
              <strong>Incorrect Answers:</strong> {analysis.overallPerformance.incorrectAnswers}
            </p>

            <h3 className="text-lg font-semibold mt-4">📖 Topic-Wise Analysis</h3>
            {Object.entries(analysis.topicWiseAnalysis).map(([topic, details]) => (
              <div key={topic} className="mt-2 p-3 bg-gray-100 rounded-md">
                <h4 className="font-semibold text-gray-800">{topic}</h4>
                <p className="text-gray-600">
                  <strong>Accuracy:</strong> {details.accuracy}%
                </p>
                <p className="text-gray-600">
                  <strong>Incorrect Areas:</strong> {details.areasForImprovement.join(", ")}
                </p>
                {details.youtubePlaylists.length > 0 && (
                  <p className="text-blue-500 mt-1">
                    <strong>🔗 Resources:</strong>{" "}
                    {details.youtubePlaylists.map((link, index) => (
                      <a key={index} href={link} target="_blank" rel="noopener noreferrer">
                        [Playlist {index + 1}]
                      </a>
                    ))}
                  </p>
                )}
              </div>
            ))}

            <button
              className="mt-4 w-full text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition"
              onClick={() => setShowModal(false)}
            >
              ❌ Close
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center mt-4">
          <p className="text-gray-600">⏳ Generating AI guidance...</p>
        </div>
      )}
    </div>
  );
};

export default GuidanceDetails;

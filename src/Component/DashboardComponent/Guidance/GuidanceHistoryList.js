import React, { useEffect, useState } from "react";
import { account, databases } from "../../../appwrite/appwriteConfig";
import { Query } from "appwrite";
import { useNavigate } from "react-router-dom";

const GuidanceHistoryList = () => {
  const daily_test_coll = process.env.REACT_APP_DAILY_TEST_COLLECTION;
  const dbId = process.env.REACT_APP_DATABASE_ID;
  const navigate = useNavigate();

  const [guidanceHistory, setGuidanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = await account.get();
        const studentId = user.$id;

        const response = await databases.listDocuments(dbId, daily_test_coll, [
          Query.equal("student_id", studentId),
          Query.orderDesc("$updatedAt"), // Sort by most recent first
        ]);

        setGuidanceHistory(response.documents);
      } catch (error) {
        console.error("Error fetching guidance history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        📚 Guidance History
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">⏳ Loading...</p>
      ) : guidanceHistory.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guidanceHistory.map((test) => (
            <div
              key={test.$id}
              className="bg-white p-5 shadow-lg rounded-xl border border-gray-200 hover:shadow-2xl transition duration-300"
            >
              {/* Subject and Topic */}
              <h2 className="text-lg font-semibold text-gray-700">{test.subject}</h2>
              <p className="text-sm text-gray-600">
                📌 Topics: {test.topics && test.topics.length > 0 ? test.topics.join(", ") : "N/A"}
              </p>

              {/* Score & Date-Time */}
              <div className="flex justify-between items-center mt-2 text-gray-500">
                <p>
                  <span className="font-medium text-gray-600">Score:</span> {test.marks}/80
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(test.$updatedAt).toLocaleDateString()}{" "}
                  {new Date(test.$updatedAt).toLocaleTimeString()}
                </p>
              </div>

              {/* View Details Button */}
              <div className="mt-4">
                <button
                  className="w-full text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium transition"
                  onClick={() => navigate(`/dashboard/guidance/${test.$id}`)}
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

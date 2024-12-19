import React, { useEffect, useState } from "react";
import { account, databases } from "../../../appwrite/appwriteConfig";
import { Query } from "appwrite";
import { Bar, Line, Pie } from "react-chartjs-2";
import "chart.js/auto";

export default function PerformancePage() {
  const [overallStats, setOverallStats] = useState({
    totalTests: 0,
    averageMarks: 0,
    accuracy: 0,
  });
  const [subjectStats, setSubjectStats] = useState([]);
  const [testHistory, setTestHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const databaseId = process.env.REACT_APP_DATABASE_ID;
  const mockTestCollectionId = process.env.REACT_APP_MOCK_TEST_ID;

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const student = await account.get();
        const studentId = student.$id;

        // Fetch all mock tests for the student
        const response = await databases.listDocuments(databaseId, mockTestCollectionId, [
          Query.equal("student_id", studentId),
        ]);

        const tests = response.documents;

        // Calculate overall stats
        const totalTests = tests.length;
        const totalMarks = tests.reduce((sum, test) => sum + test.marks, 0);
        const totalAttempted = tests.reduce((sum, test) => sum + test.attempted, 0);
        const totalCorrect = tests.reduce((sum, test) => sum + test.correct, 0);

        const averageMarks = totalTests > 0 ? (totalMarks / totalTests).toFixed(2) : 0;
        const accuracy = totalAttempted > 0 ? ((totalCorrect / totalAttempted) * 100).toFixed(2) : 0;

        setOverallStats({
          totalTests,
          averageMarks,
          accuracy,
        });

        // Calculate subject-wise stats
        const subjects = [...new Set(tests.map((test) => test.subject))];
        const subjectStats = subjects.map((subject) => {
          const subjectTests = tests.filter((test) => test.subject === subject);
          const subjectMarks = subjectTests.reduce((sum, test) => sum + test.marks, 0);
          const subjectAverageMarks = (subjectMarks / subjectTests.length).toFixed(2);
          return {
            subject,
            averageMarks: subjectAverageMarks,
          };
        });
        setSubjectStats(subjectStats);

        // Sort tests by date for history
        const sortedTests = tests.sort(
          (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
        );
        setTestHistory(sortedTests);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformanceData();
  }, [databaseId, mockTestCollectionId]);

  if (isLoading) {
    return <div>Loading performance data...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Performance Overview</h1>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Total Tests</p>
          <p className="text-3xl font-semibold text-gray-900">{overallStats.totalTests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Average Marks</p>
          <p className="text-3xl font-semibold text-gray-900">{overallStats.averageMarks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Accuracy (%)</p>
          <p className="text-3xl font-semibold text-gray-900">{overallStats.accuracy}%</p>
        </div>
      </div>

      {/* Subject-Wise Performance */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subject-Wise Performance</h2>
        <Bar
          data={{
            labels: subjectStats.map((stat) => stat.subject),
            datasets: [
              {
                label: "Average Marks",
                data: subjectStats.map((stat) => stat.averageMarks),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
            },
          }}
        />
      </div>

      {/* Test History */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Test History</h2>
        <div className="space-y-4">
          {testHistory.slice(0, 3).map((test, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b"
            >
              <div>
                <p className="font-medium text-gray-900">{test.subject}</p>
                <p className="text-sm text-gray-500">
                  {new Date(test.$createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-indigo-600 font-semibold">{test.marks}/100</span>
            </div>
          ))}
          {testHistory.length > 3 && (
            <p className="text-indigo-600 text-sm font-medium hover:underline mt-4">
              View All
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

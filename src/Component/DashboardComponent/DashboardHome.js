import React, { useEffect, useState } from "react";
import { databases, account } from "../../appwrite/appwriteConfig";
import { Query } from "appwrite";
import { BookOpen, Users, Clock, Trophy } from "lucide-react";
import { DashboardLoader } from "./DashboardLoader";

export function DashboardHome() {
  const [recentTests, setRecentTests] = useState([]); // To store the recent tests
  const [visibleTests, setVisibleTests] = useState(3); // Number of tests to show initially
  const [isLoading, setIsLoading] = useState(true); // Loader flag

  const databaseId = process.env.REACT_APP_DATABASE_ID;
  const mockTestCollectionId = process.env.REACT_APP_MOCK_TEST_ID;

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const student = await account.get(); // Get the current student
        const studentId = student.$id;

        // Fetch mock tests for the student, sorted by creation date
        const response = await databases.listDocuments(databaseId, mockTestCollectionId, [
          Query.equal("student_id", studentId),
          Query.orderDesc("$createdAt"),
        ]);

        setRecentTests(response.documents); // Set fetched tests
      } catch (error) {
        console.error("Error fetching recent tests:", error);
      } finally {
        setIsLoading(false);
      }
    };


    fetchTests();
  }, [databaseId, mockTestCollectionId]);

  console.log(recentTests);


  const stats = [
    { icon: BookOpen, label: "Tests Completed", value: recentTests.length },
    { icon: Clock, label: "Study Hours", value: "NA" }, // Placeholder
    { icon: Users, label: "Global Rank", value: "NA" }, // Placeholder
    { icon: Trophy, label: "Achievements", value: "NA" }, // Placeholder
  ];

  const handleSeeMore = () => {
    setVisibleTests((prev) => prev + 3); // Show 3 more tests
  };

  if(isLoading) return <DashboardLoader/>

  if(isLoading)
    return <DashboardLoader/>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome back, Student!</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <stat.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tests Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tests</h2>
        {isLoading ? (
          <div>Loading tests...</div>
        ) : recentTests.length === 0 ? (
          <div>No tests found.</div>
        ) : (
          <div>
            <div className="space-y-4">
              {recentTests.slice(0, visibleTests).map((test, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium text-gray-900">{test.subject}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(test.$createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-indigo-600 font-semibold">{test.marks}/100</span>
                </div>
              ))}
            </div>

            {visibleTests < recentTests.length && (
              <button
                onClick={handleSeeMore}
                className="text-indigo-600 text-sm font-medium hover:underline mt-4"
              >
                See More
              </button>
            )}
          </div>
        )}
      </div>

      {/* Upcoming Tests Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tests</h2>
        <div className="space-y-4">
          {["Physics", "Chemistry", "Mathematics"].map((subject, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium text-gray-900">{subject} Mock Test</p>
                <p className="text-sm text-gray-500">To be announced</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Clock, FileText, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { databases } from "../appwrite/appwriteConfig";
import { Query } from "appwrite";

export function TestsPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const databaseId = process.env.REACT_APP_DATABASE_ID;
  const collectionId = process.env.REACT_APP_QUESTION_ID;

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId);

        // Group questions by subject
        const groupedTests = response.documents.reduce((acc, question) => {
          if (!acc[question.subject]) {
            acc[question.subject] = {
              name: `${question.subject.charAt(0).toUpperCase()}${question.subject.slice(
                1
              )} Test`,
              duration: "2 hours", // Placeholder duration
              questions: 0,
              topics: new Set(),
              subject: question.subject,
            };
          }

          acc[question.subject].questions += 1;
          acc[question.subject].topics.add(question.topic);
          return acc;
        }, {});

        // Convert grouped tests into an array
        setTests(
          Object.values(groupedTests).map((test) => ({
            ...test,
            topics: Array.from(test.topics),
          }))
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tests:", error);
        setIsLoading(false);
      }
    };

    fetchTests();
  }, [databaseId, collectionId]);

  const handleStartTest = (subject) => {
    navigate(`/quiz/${subject}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Tests</h1>

      <div className="grid gap-6">
        {tests.map((test, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {test.duration}
                  </span>
                  <span className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    {test.questions} questions
                  </span>
                </div>
                <div className="mt-2">
                  {test.topics.map((topic, i) => (
                    <span
                      key={i}
                      className="inline-block bg-indigo-50 text-indigo-600 text-sm px-3 py-1 rounded-full mr-2 mt-2"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleStartTest(test.subject)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Start Test
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

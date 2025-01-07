import React, { useEffect, useState, useCallback, useRef } from "react";
import { Clock, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { account, databases } from "../appwrite/appwriteConfig";
import { Query } from "appwrite";
import { Loader } from "./Loader";

export function TestsPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTests, setLoadingTests] = useState({});

  const databaseId = process.env.REACT_APP_DATABASE_ID;
  const collectionId = process.env.REACT_APP_QUESTION_ID;
  const mock_test_collId = process.env.REACT_APP_MOCK_TEST_ID;

  const isFetching = useRef(false);

  const fetchTests = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      let allQuestions = [];
      let response = await databases.listDocuments(databaseId, collectionId, []);

      allQuestions = response.documents;

      while (response.total > allQuestions.length) {
        response = await databases.listDocuments(databaseId, collectionId, [
          Query.offset(allQuestions.length),
          Query.limit(100),
        ]);
        allQuestions = [...allQuestions, ...response.documents];
      }

      const groupedTests = allQuestions.reduce((acc, question) => {
        if (!acc[question.topic]) {
          acc[question.topic] = {
            name: `${question.topic.charAt(0).toUpperCase()}${question.topic.slice(1)} Test`,
            duration: "2 hours",
            questions: [],
            topics: new Set(),
            subject: question.subject,
          };
        }

        acc[question.topic].questions.push(question);
        acc[question.topic].topics.add(question.topic);
        return acc;
      }, {});

      const formattedTests = Object.values(groupedTests).map((test) => ({
        ...test,
        topics: Array.from(test.topics),
      }));

      setTests(formattedTests);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching tests:", error);
      setIsLoading(false);
    } finally {
      isFetching.current = false;
    }
  }, [databaseId, collectionId]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const handleStartOrContinueTest = useCallback(
    async (test) => {
      setLoadingTests((prev) => ({ ...prev, [test.topic]: true }));
      try {
        const student = await account.get();
        if (!student || !student.$id) {
          console.error("Student not found");
          return;
        }

        const existingMockTests = await databases.listDocuments(databaseId, mock_test_collId, [
          Query.equal("student_id", student.$id),
          Query.equal("subject", test.topics[0]),
        ]);

        if (existingMockTests.documents.length > 0) {
          const sortedTests = existingMockTests.documents.sort(
            (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
          );
          const latestMockTest = sortedTests[0];

          if (latestMockTest.status === "completed") {
            await databases.createDocument(databaseId, mock_test_collId, "unique()", {
              student_id: student.$id,
              student_name: student.name,
              subject: test.subject,
              topics: test.topics,
              marks: 0,
              attempted: 0,
              correct: 0,
              wrong: 0,
              status: "started",
            });
          } else {
            await databases.updateDocument(databaseId, mock_test_collId, latestMockTest.$id, {
              status: "started",
            });
          }
        } else {
          await databases.createDocument(databaseId, mock_test_collId, "unique()", {
            student_id: student.$id,
            student_name: student.name,
            subject: test.subject,
            topics: test.topics,
            marks: 0,
            attempted: 0,
            correct: 0,
            wrong: 0,
            status: "started",
          });
        }

        navigate(`/quiz/${test.topics[0]}`);
      } catch (error) {
        console.error("Error handling test start or continuation:", error);
      } finally {
        setLoadingTests((prev) => ({ ...prev, [test.topic]: false }));
      }
    },
    [databaseId, mock_test_collId, navigate]
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Tests</h1>

      {/* Continue Tests Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Continue Tests</h2>
        <div className="flex overflow-x-auto gap-4">
          {tests
            .filter((test) => localStorage.getItem(`testState_${test.topics[0]}`))
            .map((test, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm min-w-[250px]"
              >
                <h3 className="text-md font-semibold text-gray-900">{test.topics}</h3>
                <button
                  onClick={() => handleStartOrContinueTest(test)}
                  className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  disabled={loadingTests[test.topic]}
                >
                  {loadingTests[test.topic] ? "Loading..." : "Continue Test"}
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* All Tests Section */}
      <div className="grid gap-6">
        {tests.map((test, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900">{test.topics}</h3>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {test.duration}
                </span>
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  {test.questions.length} questions
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {test.topics.map((topic, i) => (
                  <span
                    key={i}
                    className="inline-block bg-indigo-50 text-indigo-600 text-sm px-3 py-1 rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <div className="mt-4">
                <button
                  onClick={() => handleStartOrContinueTest(test)}
                  className="w-full sm:w-40 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  disabled={loadingTests[test.topic]}
                >
                  {loadingTests[test.topic] ? (
                    <span className="flex items-center justify-center">Starting...</span>
                  ) : localStorage.getItem(`testState_${test.topics[0]}`) ? (
                    "Continue Test"
                  ) : (
                    "Start Test"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

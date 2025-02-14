import React, { useEffect, useState, useCallback, useRef } from "react";
import { Clock, FileText, BookOpen } from "lucide-react";
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
    setIsLoading(true);
  
    try {
      // Fetch the first batch to get total count
      let response = await databases.listDocuments(databaseId, collectionId, [Query.limit(100)]);
      let total = response.total;
      let allQuestions = response.documents;
  
      // Calculate remaining requests
      let fetchPromises = [];
      for (let offset = 100; offset < total; offset += 100) {
        fetchPromises.push(databases.listDocuments(databaseId, collectionId, [
          Query.offset(offset),
          Query.limit(100)
        ]));
      }
  
      // Fetch all remaining batches in parallel
      let responses = await Promise.all(fetchPromises);
      responses.forEach(res => allQuestions.push(...res.documents));
  
      // Grouping tests by topic
      const groupedTests = allQuestions.reduce((acc, question) => {
        if (!acc[question.topic]) {
          acc[question.topic] = {
            name: `${question.topic.charAt(0).toUpperCase()}${question.topic.slice(1)} Test`,
            duration: "40 minutes",
            questions: [],
            topics: new Set(),
            subject: question.subject,
          };
        }
        acc[question.topic].questions.push(question);
        acc[question.topic].topics.add(question.topic);
        return acc;
      }, {});
  
      // Convert topics Set to an array
      const formattedTests = Object.values(groupedTests).map((test) => ({
        ...test,
        topics: Array.from(test.topics),
      }));
  
      setTests(formattedTests);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      isFetching.current = false;
      setIsLoading(false);
    }
  }, [databaseId, collectionId]);
  

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const handleStartOrContinueTest = useCallback(
    async (test) => {
      const testId = test.topics[0]; // Use the first topic as unique identifier
      setLoadingTests((prev) => ({ ...prev, [testId]: true }));
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
        setLoadingTests((prev) => ({ ...prev, [testId]: false }));
      }
    },
    [databaseId, mock_test_collId, navigate]
  );

  if (isLoading) {
    return <Loader />;
  }

  const groupedBySubject = tests.reduce((acc, test) => {
    if (!acc[test.subject]) {
      acc[test.subject] = [];
    }
    acc[test.subject].push(test);
    return acc;
  }, {});

  const continuableTests = tests.filter((test) => 
    localStorage.getItem(`testState_${test.topics[0]}`)
  );

  return(
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">My Tests</h1>

      {/* Continue Tests Section */}
      {continuableTests.length > 0 && (
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-indigo-600" />
            Continue Tests
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {continuableTests.map((test, index) => (
              <div
                key={index}
                className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {test.topics.join(", ")}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                  <span className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    20 questions
                  </span>
                </div>
                <button
                  onClick={() => handleStartOrContinueTest(test)}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                  disabled={loadingTests[test.topics[0]]}
                >
                  {loadingTests[test.topics[0]] ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    "Continue Test"
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Tests Section */}
      <div className="space-y-8">
        {Object.entries(groupedBySubject).map(([subject, subjectTests], index) => (
          <section key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
              {subject}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectTests.map((test, testIndex) => (
                <div
                  key={testIndex}
                  className="bg-white p-5 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {test.topics.join(", ")}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {test.duration}
                      </span>
                      <span className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        20 questions
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {test.topics.map((topic, i) => (
                        <span
                          key={i}
                          className="inline-block bg-indigo-50 text-indigo-600 text-sm px-3 py-1 rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleStartOrContinueTest(test)}
                      className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                      disabled={loadingTests[test.topics[0]]}
                    >
                      {loadingTests[test.topics[0]] ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Starting...
                        </span>
                      ) : localStorage.getItem(`testState_${test.topics[0]}`) ? (
                        "Continue Test"
                      ) : (
                        "Start Test"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
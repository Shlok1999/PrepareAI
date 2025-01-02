import React, { useEffect, useState } from "react";
import { Clock, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { account, databases } from "../appwrite/appwriteConfig";
import { Query } from "appwrite";
import { Loader } from "./Loader";


export function TestsPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]); // Holds all tests grouped by subject
  const [isLoading, setIsLoading] = useState(true); // Loader flag

  const databaseId = process.env.REACT_APP_DATABASE_ID;
  const collectionId = process.env.REACT_APP_QUESTION_ID;
  const mock_test_collId = process.env.REACT_APP_MOCK_TEST_ID;

  useEffect(() => {
    const fetchTests = async () => {
      try {
        let allQuestions = [];
        let response = await databases.listDocuments(databaseId, collectionId, [
          // Query.limit(500),
        ]);

        allQuestions = response.documents;

        // Check for pagination and fetch additional questions
        while (response.total > allQuestions.length) {
          response = await databases.listDocuments(databaseId, collectionId, [
            Query.offset(allQuestions.length),
            Query.limit(100),
          ]);
          allQuestions = [...allQuestions, ...response.documents];
        }

        // Group questions by subject
        const groupedTests = allQuestions.reduce((acc, question) => {
          if (!acc[question.subject]) {
            acc[question.subject] = {
              name: `${question.subject.charAt(0).toUpperCase()}${question.subject.slice(1)} Test`,
              duration: "2 hours",
              questions: [],
              topics: new Set(),
              subject: question.subject,
            };
          }

          acc[question.subject].questions.push(question);
          acc[question.subject].topics.add(question.topic);
          return acc;
        }, {});

        // Format grouped tests
        const formattedTests = Object.values(groupedTests).map((test) => ({
          ...test,
          topics: Array.from(test.topics),
        }));

        setTests(formattedTests);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tests:", error);
        setIsLoading(false);
      }
    };

    fetchTests();
  }, [databaseId, collectionId]);

  const handleStartOrContinueTest = async (test) => {
    try {
      const student = await account.get();
      if (!student || !student.$id) {
        console.error("Student not found");
        return;
      }
  
      // Fetch existing mock test document for the student and subject
      const existingMockTests = await databases.listDocuments(databaseId, mock_test_collId, [
        Query.equal("student_id", student.$id),
        Query.equal("subject", test.subject),
      ]);
  
      if (existingMockTests.documents.length > 0) {
        // Sort tests by creation date to get the latest one
        const sortedTests = existingMockTests.documents.sort(
          (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
        );
        const latestMockTest = sortedTests[0];
  
        if (latestMockTest.status === "completed") {
          // If the latest test is completed, create a new mock test
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
          console.log("New mock test document created.");
        } else {
          // If the latest test is not completed, update its status to "in_progress"
          await databases.updateDocument(databaseId, mock_test_collId, latestMockTest.$id, {
            status: "started",
          });
          console.log("Mock test status updated to 'in_progress'.");
        }
      } else {
        // No existing test found, create a new one
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
        console.log("New mock test document created.");
      }
  
      // Navigate to the quiz page
      navigate(`/quiz/${test.subject}`);
    } catch (error) {
      console.error("Error handling test start or continuation:", error);
    }
  };
  
  

  if (isLoading) {
    return <Loader/>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Tests</h1>
      <div className="grid gap-6">
        {tests.map((test, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900">{test.subject}</h3>
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
                >
                  {(() => {
                    const student = account.get();
                    const mockTest = tests.find((t) => t.subject === test.subject);
                    if (mockTest?.status === "completed") return "Retake Test";
                    return localStorage.getItem(`testState_${test.subject}`) ? "Continue Test" : "Start Test";
                  })()}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
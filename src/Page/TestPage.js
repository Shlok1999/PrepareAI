import React, { useEffect, useState } from "react";
import { Clock, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { account,databases } from "../appwrite/appwriteConfig";
import { Query } from "appwrite";

export function TestsPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const databaseId = process.env.REACT_APP_DATABASE_ID;
  const collectionId = process.env.REACT_APP_QUESTION_ID;
  const mock_test_collId = process.env.REACT_APP_MOCK_TEST_ID;

  

  // useEffect(()=>{
  //   updateTestStatus();
  // },[])

  useEffect(() => {
    const fetchTests = async () => {
      try {
        let allQuestions = [];
        let response = await databases.listDocuments(databaseId, collectionId, [
          Query.limit(500),
        ]);

        allQuestions = response.documents;

        while (response.total > allQuestions.length) {
          response = await databases.listDocuments(databaseId, collectionId, [
            Query.offset(allQuestions.length),
            Query.limit(100),
          ]);
          allQuestions = [...allQuestions, ...response.documents];
        }

        const groupedTests = allQuestions.reduce((acc, question) => {
          if (!acc[question.subject]) {
            acc[question.subject] = {
              name: `${question.subject.charAt(0).toUpperCase()}${question.subject.slice(
                1
              )} Test`,
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

        const formattedTests = Object.values(groupedTests).map((test) => ({
          ...test,
          questions: shuffleArray(test.questions),
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
      // Fetch the current student details
      const student = await account.get();
      if (!student || !student.$id) {
        console.error("Student not found");
        return;
      }
  
      // Fetch existing mock test document for the student and subject
      const existingMockTest = await databases.listDocuments(databaseId, mock_test_collId, [
        Query.equal("student_id", student.$id),
        Query.equal("subject", test.subject),
      ]);
  
      if (existingMockTest.documents.length > 0) {
        // If the document exists, update the status to "in_progress"
        const mockTestId = existingMockTest.documents[0].$id;
        await databases.updateDocument(databaseId, mock_test_collId, mockTestId, {
          status: "started",
        });
        console.log("Mock test status updated to 'in_progress'.");
      } else {
        // If no document exists, create a new one with all required fields
        await databases.createDocument(databaseId, mock_test_collId, "unique()", {
          student_id: student.$id,
          student_name: student.name,
          status: "started", // Set initial status
          marks: 0, // Initial marks set to 0
          subject: test.subject, // Set subject
          topics: test.topics, // Set topics
          attempted: 0, // Initial attempted questions count
          correct: 0, // Initial correct answers count
          wrong: 0, // Initial wrong answers count
        });
        console.log("New mock test document created.");
      }
  
      // Navigate to the quiz page
      navigate(`/quiz/${test.subject}`);
    } catch (error) {
      console.error("Error handling test start or continuation:", error);
    }
  };
  
  

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
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
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900">
                {test.subject}
              </h3>
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
                  {localStorage.getItem(`testState_${test.subject}`)
                    ? "Continue Test"
                    : "Start Test"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

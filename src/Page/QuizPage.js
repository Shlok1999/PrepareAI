import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { databases, account } from "../appwrite/appwriteConfig";
import { QuizLayout } from "../Component/DashboardComponent/Quiz/QuizLayout";
import { Question } from "../Component/DashboardComponent/Quiz/Question";
import { Navigation } from "../Component/DashboardComponent/Quiz/Navigation";
import { QuestionGrid } from "../Component/DashboardComponent/Quiz/QuestionGrid";
import { StartTestModal } from "../Component/DashboardComponent/Quiz/StartTestModal";
import { ResultsModal } from "../Component/DashboardComponent/Quiz/ResultsModal";
import { Query } from "appwrite";

export default function QuizPage() {
  const { topic } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [timePerQuestions, setTimePerQuestions] = useState(2);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [endTime, setEndTime] = useState(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [quizResults, setQuizResults] = useState({
    attempted: 0,
    correct: 0,
    wrong: 0,
    totalMarks: 0,
  });

  const databaseId = process.env.REACT_APP_DATABASE_ID;
  const collectionId = process.env.REACT_APP_QUESTION_ID;
  const mock_test_collId = process.env.REACT_APP_MOCK_TEST_ID;
  const test_result_collId = process.env.REACT_APP_DAILY_TEST_COLLECTION;

  useEffect(() => {
    const loadTestState = () => {
      const savedState = JSON.parse(localStorage.getItem(`testState_${topic}`));
      const savedQuestions = JSON.parse(localStorage.getItem(`questions_${topic}`));

      if (savedState && savedQuestions) {
        setQuestions(savedQuestions);
        setCurrentQuestion(savedState.currentQuestion);
        setAnswers(savedState.answers);
        setEndTime(new Date(savedState.endTime));
        setIsLoading(false);
        return true;
      }
      return false;
    };

    const fetchQuestions = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId, [
          Query.equal("topic", topic),
          Query.limit(20),
        ]);

        if (response.documents.length > 0) {
          const shuffledQuestions = shuffleArray(response.documents);
          setQuestions(shuffledQuestions);
          setAnswers(Array(shuffledQuestions.length).fill(null));
          localStorage.setItem(`questions_${topic}`, JSON.stringify(shuffledQuestions));
        } else {
          console.warn(`No questions found for topic: ${topic}`);
        }

        const calculatedEndTime = new Date();
        calculatedEndTime.setHours(calculatedEndTime.getHours() + 2);
        setEndTime(calculatedEndTime);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setIsLoading(false);
      }
    };

    if (!loadTestState()) {
      fetchQuestions();
    }
  }, [topic, databaseId, collectionId]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const saveTestState = () => {
    localStorage.setItem(
      `testState_${topic}`,
      JSON.stringify({
        currentQuestion,
        answers,
        endTime,
      })
    );
  };

  const handleAnswerSelect = (answerId) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerId;
    setAnswers(newAnswers);
    saveTestState();
  };

  const handleFlagToggle = () => {
    setFlaggedQuestions((prev) => {
      const updated = new Set(prev);
      if (updated.has(currentQuestion)) {
        updated.delete(currentQuestion);
      } else {
        updated.add(currentQuestion);
      }
      return updated;
    });
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => Math.max(0, prev - 1));
    saveTestState();
  };

  const handleNext = () => {
    setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1));
    saveTestState();
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestion(index);
    saveTestState();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    let attempted = 0,
      correct = 0,
      wrong = 0;

    answers.forEach((ans, index) => {
      if (ans !== null) {
        attempted++;
        if (questions[index].options[ans] === questions[index].correct_answer) {
          correct++;
        } else {
          wrong++;
        }
      }
    });

    const totalMarks = correct * 4 - wrong * 1;
    const results = { attempted, correct, wrong, totalMarks };

    try {
      const student = await account.get();
      const studentId = student.$id;

      const existingMockTest = await databases.listDocuments(databaseId, mock_test_collId, [
        Query.equal("student_id", studentId),
        Query.equal("topics", topic),
      ]);

      if (existingMockTest.documents.length > 0) {
        const sortedTests = existingMockTest.documents.sort(
          (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
        );
        const latestMockTest = sortedTests[0];

        await databases.updateDocument(databaseId, mock_test_collId, latestMockTest.$id, {
          marks: totalMarks,
          attempted: attempted,
          correct: correct,
          wrong: wrong,
          status: "completed",
        });
      }

      // Log Test Details in Console
      const testQuestionDetails = questions.map((q, index) => ({
        question: q.question_text,
        selectedAnswer: answers[index] !== null ? q.options[answers[index]] : "Unanswered",
        correctAnswer: q.correct_answer,
        solution: q.solution,
        explanation: q.explanation || "No explanation provided",
      }));

      console.log("Test Completed. Detailed Breakdown:", testQuestionDetails);

      try {
        const saveTestToDb = await databases.createDocument(databaseId, test_result_collId, "unique()", {
          student_id: studentId,
          subject: questions[0].subject,
          topics: [topic],
          test_question_details: JSON.stringify(testQuestionDetails),
          marks: totalMarks,
        });
        console.log("Test results saved successfully...", saveTestToDb);
      } catch (error) {
        console.error("Error saving test results:", error); 
      }
     

    } catch (error) {
      console.error("Error updating mock test collection:", error);
    } finally {
      setTimeout(() => {
        setQuizResults(results);
        localStorage.removeItem(`testState_${topic}`);
        localStorage.removeItem(`questions_${topic}`);
        setIsSubmitting(false);
        setIsResultsModalOpen(true);
      }, 1500);
    }
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  if (isLoading) return <div>Loading questions...</div>;
  if (questions.length === 0) return <div>No questions found for {topic}</div>;

  return (
    <>
      {isTestModalOpen && (
        <StartTestModal
          topic={topic}
          duration={questions.length * 2}
          questionCount={questions.length}
          onStart={() => setIsTestModalOpen(false)}
          onClose={() => navigate("/dashboard/tests")}
        />
      )}

      {!isTestModalOpen && (
        <>
          <QuizLayout totalTime={questions.length * 2} onTimeUp={handleTimeUp}>
            <Question
              question={questions[currentQuestion]}
              selectedAnswer={answers[currentQuestion]}
              isFlagged={flaggedQuestions.has(currentQuestion)}
              onAnswerSelect={handleAnswerSelect}
              onFlag={handleFlagToggle}
            />
            <Navigation
              currentQuestion={currentQuestion}
              totalQuestions={questions.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleSubmit}
            />
            <QuestionGrid
              totalQuestions={questions.length}
              currentQuestion={currentQuestion}
              answers={answers}
              flaggedQuestions={flaggedQuestions}
              onQuestionSelect={handleQuestionSelect}
            />
          </QuizLayout>
        </>
      )}

      <ResultsModal isOpen={isResultsModalOpen} onClose={() => navigate("/dashboard/tests")} results={quizResults} />
    </>
  );
}

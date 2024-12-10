import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { databases } from "../appwrite/appwriteConfig";
import { QuizLayout } from "../Component/DashboardComponent/Quiz/QuizLayout";
import { Question } from "../Component/DashboardComponent/Quiz/Question";
import { Navigation } from "../Component/DashboardComponent/Quiz/Navigation";
import { QuestionGrid } from "../Component/DashboardComponent/Quiz/QuestionGrid";
import { StartTestModal } from "../Component/DashboardComponent/Quiz/StartTestModal";
import { Query } from "appwrite";

export default function QuizPage() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [endTime, setEndTime] = useState(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const databaseId = process.env.REACT_APP_DATABASE_ID;
  const collectionId = process.env.REACT_APP_QUESTION_ID;

  useEffect(() => {
    const loadTestState = () => {
      const savedState = JSON.parse(localStorage.getItem(`testState_${subject}`));
      const savedQuestions = JSON.parse(localStorage.getItem(`questions_${subject}`));

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
          Query.equal("subject", subject),
          Query.limit(90),
        ]);

        if (response.documents.length > 0) {
          const shuffledQuestions = shuffleArray(response.documents);
          setQuestions(shuffledQuestions);
          setAnswers(Array(shuffledQuestions.length).fill(null));
          localStorage.setItem(`questions_${subject}`, JSON.stringify(shuffledQuestions));
        } else {
          console.warn(`No questions found for subject: ${subject}`);
        }

        const calculatedEndTime = new Date();
        calculatedEndTime.setHours(calculatedEndTime.getHours() + 48);
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
  }, [subject, databaseId, collectionId]);

  // Utility to shuffle an array
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
      `testState_${subject}`,
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

  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
    localStorage.removeItem(`testState_${subject}`);
    localStorage.removeItem(`questions_${subject}`);
    navigate("/dashboard/tests");
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  // Check if the test has expired
  if (endTime && new Date() > new Date(endTime)) {
    return <div>The test time has expired. Please contact your instructor.</div>;
  }

  if (isLoading) return <div>Loading questions...</div>;
  if (questions.length === 0) return <div>No questions found for {subject}</div>;

  return (
    <>
      {isTestModalOpen && (
        <StartTestModal
          subject={subject}
          duration={120} // Assuming 120 minutes for the test
          questionCount={questions.length}
          onStart={() => setIsTestModalOpen(false)}
          onClose={() => navigate("/dashboard/tests")}
        />
      )}

      {!isTestModalOpen && (
        <QuizLayout totalTime={120} onTimeUp={handleTimeUp}>
          <Question
            question={questions[currentQuestion]}
            selectedAnswer={answers[currentQuestion]}
            isFlagged={flaggedQuestions.has(currentQuestion)}
            onAnswerSelect={handleAnswerSelect}
            onFlag={handleFlagToggle}
          />
          <QuestionGrid
            totalQuestions={questions.length}
            currentQuestion={currentQuestion}
            answers={answers}
            flaggedQuestions={flaggedQuestions}
            onQuestionSelect={handleQuestionSelect}
          />
          <Navigation
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
          />
        </QuizLayout>
      )}
    </>
  );
}

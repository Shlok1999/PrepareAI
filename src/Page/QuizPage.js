import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { QuizLayout } from "../../components/quiz/QuizLayout";
// import { Question } from "../../components/quiz/Question";
// import { Navigation } from "../../components/quiz/Navigation";
import { databases } from "../appwrite/appwriteConfig";
import { Query } from "appwrite";

export function QuizPage() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const databaseId = process.env.REACT_APP_DATABASE_ID;
  const collectionId = process.env.REACT_APP_COLLECTION_ID_QUESTION;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId, [
          Query.equal("subject", subject),
        ]);

        setQuestions(response.documents);
        setAnswers(Array(response.documents.length).fill(null));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [subject, databaseId, collectionId]);

  const handleAnswerSelect = (answerId) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerId;
    setAnswers(newAnswers);
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1));
  };

  const handleSubmit = () => {
    console.log("Submitted answers:", answers);
    navigate("/dashboard/tests");
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!questions.length) {
    return <div>No questions found for {subject}</div>;
  }

  return (
    // <QuizLayout totalTime={120} onTimeUp={handleTimeUp}>
    //   <Question
    //     question={questions[currentQuestion]}
    //     selectedAnswer={answers[currentQuestion]}
    //     onAnswerSelect={handleAnswerSelect}
    //   />
      {/* <Navigation
        currentQuestion={currentQuestion}
        totalQuestions={questions.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
      /> */}
    // </QuizLayout>
  );
}

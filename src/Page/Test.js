import React, { useState, useEffect } from 'react';
import { databases } from '../appwrite/appwriteConfig'; // Import Appwrite configuration
import Loader from '../Component/Loader'; // Assuming you have a Loader component
import '../Style/Test.css';

const databaseId = process.env.REACT_APP_DATABASE_ID;
const questionCollectionId = process.env.REACT_APP_COLLECTION_ID_QUESTION;

function Test() {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes = 600 seconds
  const [showResultModal, setShowResultModal] = useState(false);
  const [score, setScore] = useState(0);
  const [studentName] = useState("John Doe"); // Replace with actual student name or pass as a prop
  const [isSubmitting, setIsSubmitting] = useState(false); // Button loading state
  const [loading, setLoading] = useState(true); // Overall loading state for questions

  // Fetch questions from Appwrite
  const fetchQuestions = async () => {
    try {
      const response = await databases.listDocuments(databaseId, questionCollectionId);
      const questionsData = response.documents.map((doc) => ({
        id: doc.$id,
        question: doc.question,
        options: doc.options,
        correctAnswer: doc.correctAnswer,
      }));
      setQuestions(shuffleArray(questionsData));
      setLoading(false); // Stop loading after data is fetched
    } catch (error) {
      console.error('Error fetching questions:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(); // Fetch questions on component mount
  }, []);

  // Timer logic
  useEffect(() => {
    if (timeLeft === 0) {
      submitTest();
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSelectAnswer = (questionId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const submitTest = () => {
    setIsSubmitting(true);
    let newScore = 0;
    questions.forEach((q) => {
      const userAnswer = selectedAnswers[q.id];
      if (userAnswer === q.correctAnswer) {
        newScore += 4; // Correct answer
      } else if (userAnswer) {
        newScore -= 1; // Wrong answer
      }
    });
    setScore(newScore);
    setIsSubmitted(true);
    setShowResultModal(true);
    setIsSubmitting(false);
  };

  // Shuffle the questions using Fisher-Yates algorithm
  const shuffleArray = (array) => {
    const shuffled = array.slice(); // Copy the array
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleReview = () => {
    setShowResultModal(false);
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="test-container">
      <h1 className="test-heading">Test Page</h1>
      <div className="student-name">Student Name: {studentName}</div>
      <div className="timer">Time Left: {formatTime()}</div>

      {questions.map((q) => (
        <div key={q.id} className="question-container">
          <h3>{q.question}</h3>
          <div className="options-container">
            {q.options.map((option) => (
              <div
                key={option}
                className={`option ${isSubmitted && selectedAnswers[q.id] === option ? 'selected' : ''}`}
              >
                <label>
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={option}
                    onChange={() => handleSelectAnswer(q.id, option)}
                    disabled={isSubmitted}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
          {isSubmitted && (
            <div className="review-container">
              {selectedAnswers[q.id] === q.correctAnswer && <div className="correct">Answered Correctly</div>}
              {!selectedAnswers[q.id] && (
                <>
                  <div className="unattempted">Unattempted</div>
                  <div className="correct-answer">Correct Answer: {q.correctAnswer}</div>
                </>
              )}
              {selectedAnswers[q.id] !== q.correctAnswer && selectedAnswers[q.id] && (
                <>
                  <div className="wrong">Wrong Answer</div>
                  <div className="correct-answer">Correct Answer: {q.correctAnswer}</div>
                </>
              )}
            </div>
          )}
        </div>
      ))}

      {!isSubmitted && (
        <button
          onClick={submitTest}
          onTouchStart={submitTest}
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Test'} {/* Button shows loading state */}
        </button>
      )}

      {showResultModal && (
        <div className="result-modal">
          <div className="modal-content">
            <h2>Your Score: {score}/{questions.length * 4}</h2>
            <button onClick={handleReview} className="review-button">Review Answers</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Test;

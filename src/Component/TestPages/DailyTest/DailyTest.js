import React, { useState, useEffect } from 'react';
import '../../../Style/DailyTest.css';
import { account, databases } from '../../../appwrite/appwriteConfig';
import { Query } from 'appwrite';
import { useParams } from 'react-router-dom';

function DailyTest() {
  const { subject } = useParams(); // Only subject is passed
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [explanations, setExplanations] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [studentID, setStudentID] = useState('');
  const [loading, setLoading] = useState(true);

  const currentQuestion = questions[currentQuestionIndex];
  const databaseId = process.env.REACT_APP_DATABASE_ID;
  const questionCollectionId = process.env.REACT_APP_QUESTION_ID;
  const dailyTestCollectionId = process.env.REACT_APP_DAILY_TEST_COLLECTION;

  useEffect(() => {
    const getStudentId = async () => {
      try {
        const response = await account.get();
        setStudentID(response.$id);
      } catch (error) {
        console.log("Error fetching student ID:", error);
      }
    };
    getStudentId();
  }, []);

  const getTopicsForSubject = () => {
    const storedData = JSON.parse(localStorage.getItem('topics'));
    if (!storedData) return [];
    return storedData.data[subject] || [];
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      const topics = getTopicsForSubject();
      if (!topics.length) {
        console.error("No topics found for the selected subject.");
        setLoading(false);
        return;
      }

      try {
        // Fetch questions for all topics of the subject
        const response = await databases.listDocuments(
          databaseId,
          questionCollectionId,
          [
            Query.equal('subject', subject),
            Query.equal('topic', topics), // Match any of the selected topics
            Query.limit(5), // Limit to 50 questions
          ]
        );
        setQuestions(response.documents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setLoading(false);
      }
    };

    if (studentID) fetchQuestions();
  }, [studentID, subject]);

  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeTaken((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestion.$id]: answer,
    }));
  };

  const handleExplanationInput = (explanation) => {
    setExplanations((prevExplanations) => ({
      ...prevExplanations,
      [currentQuestion.$id]: explanation,
    }));
  };

  const handleNext = () => {
    if (!selectedAnswers[currentQuestion.$id] || !explanations[currentQuestion.$id]) {
      alert("Please select an answer and provide an explanation before proceeding.");
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = async () => {
    let finalScore = 0;

    questions.forEach((q) => {
      const selectedAnswer = selectedAnswers[q.$id];
      if (selectedAnswer === q.correct_answer) {
        finalScore += 4; // +4 for correct answers
      } else if (selectedAnswer) {
        finalScore -= 1; // -1 for wrong answers
      }
    });

    setScore(finalScore);
    setIsSubmitted(true);
    await saveTestResults(finalScore);
  };

  const saveTestResults = async (finalScore) => {
    const testQuestionDetails = JSON.stringify(
      questions.map((q) => ({
        question: q.question_text,
        selectedAnswers: selectedAnswers[q.$id] || "Unanswered",
        correctAnswer: q.correct_answer,
        solution: q.solution,
        explanation: explanations[q.$id] || "No explanation provided",
      }))
    );

    try {
      const topics = getTopicsForSubject(); // Get topics for the subject
      await databases.createDocument(databaseId, dailyTestCollectionId, "unique()", {
        student_id: studentID,
        subject,
        topics, // Save as array
        test_question_details: testQuestionDetails,
        marks: finalScore,
      });
      console.log("Test results saved successfully...");
    } catch (error) {
      console.error("Error saving test results:", error);
    }
  };

  if (loading) return <div>Loading questions...</div>;

  return (
    <div className="quiz-container">
      <div className="timer">
        Time: {Math.floor(timeTaken / 60)}:{String(timeTaken % 60).padStart(2, "0")}
      </div>

      {!isSubmitted ? (
        currentQuestion ? (
          <div className="question-card">
            <h2>Question {currentQuestionIndex + 1}</h2>
            <p dangerouslySetInnerHTML={{ __html: currentQuestion.question_text }}></p>
            <div className="options-container">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`option ${
                    selectedAnswers[currentQuestion.$id] === option ? "selected" : ""
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                  dangerouslySetInnerHTML={{ __html: option }}
                />
              ))}
            </div>
            <div className="explanation">
              <input
                placeholder="Explain your answer..."
                value={explanations[currentQuestion.$id] || ""}
                onChange={(e) => handleExplanationInput(e.target.value)}
              />
            </div>
            <button onClick={handleNext} className="next-button">
              {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        ) : (
          <div>Loading questions...</div>
        )
      ) : (
        <div className="results-container">
          <h2>Quiz Completed</h2>
          <p>Your Score: {score}</p>
          <div className="answers-container">
            {questions.map((q, index) => (
              <div
                key={index}
                className={`answer-card ${
                  selectedAnswers[q.$id] === q.correct_answer
                    ? "correct"
                    : selectedAnswers[q.$id]
                    ? "incorrect"
                    : "unanswered"
                }`}
              >
                <h3>Question {index + 1}</h3>
                <p dangerouslySetInnerHTML={{ __html: q.question_text }}></p>
                <p>
                  <strong>Your Answer:</strong> {selectedAnswers[q.$id] || "Unanswered"}
                </p>
                <p>
                  <strong>Correct Answer:</strong> {q.correct_answer}
                </p>
                <p>
                  <strong>Your Explanation:</strong>{" "}
                  {explanations[q.$id] || "No explanation provided"}
                </p>
                <p>
                  <strong>Solution:</strong> {q.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyTest;

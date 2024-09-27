import React, { useState, useEffect } from 'react';
import '../Style/Test.css';

const questions = [
  {
    id: 1,
    question: "Two identical spherical conductors, A and B, are separated by a distance much larger than their radii. They carry charges q1 and q2, respectively. They are brought in contact and then separated again. The new charges on A and B are:",
    options: [
      "q1 + q2 / 4 on A and 3(q1 + q2) / 4 on B.",
      "q1 + q2 / 2 on both A and B.",
      "q1 - q2 / 2 on A and q1 + q2 / 2 on B.",
      "The charge on each sphere depends on the material they are made of."
    ],
    correctAnswer: "q1 + q2 / 2 on both A and B."
  },
  {
    id: 2,
    question: "A point charge +Q is placed at the center of a cube. The electric flux through one of its faces is:",
    options: [
      "Q / (6ε0)",
      "Q / (8ε0)",
      "Q / (4ε0)",
      "Q / (12ε0)"
    ],
    correctAnswer: "Q / (6ε0)"
  },
  {
    id: 3,
    question: "Two point charges, +3 μC and -3 μC, are placed 10 cm apart. The electric field at the midpoint between the two charges is:",
    options: [
      "Directed towards the negative charge.",
      "Zero.",
      "Directed towards the positive charge.",
      "Perpendicular to the line joining the two charges."
    ],
    correctAnswer: "Zero."
  },
  {
    id: 4,
    question: "A charge +Q is placed at a distance d from an infinite grounded conducting plane. The force of attraction between the charge and the plane is proportional to:",
    options: [
      "Q^2 / d^2",
      "Q^2 / d",
      "Q^2 / (2d^2)",
      "Q^2 / (4d^2)"
    ],
    correctAnswer: "Q^2 / (4d^2)"
  },
  {
    id: 5,
    question: "The charge on a small conducting sphere of radius R is q. If another conducting sphere of radius 2R touches the first one and is then removed, the charge on the second sphere will be:",
    options: [
      "q / 2",
      "2q / 3",
      "q / 3",
      "q / 4"
    ],
    correctAnswer: "2q / 3"
  },
  {
    id: 6,
    question: "An electric dipole of moment p is placed in a uniform electric field E. The torque acting on the dipole is maximum when:",
    options: [
      "p || E",
      "p ⊥ E",
      "p makes an angle of 45° with E",
      "Torque is always zero in a uniform field."
    ],
    correctAnswer: "p ⊥ E"
  },
  {
    id: 7,
    question: "Two charges of magnitudes +Q and -Q are placed on the x-axis at positions x = -a and x = +a, respectively. The potential energy of the system is:",
    options: [
      "Proportional to 1/a",
      "Zero.",
      "Proportional to 1/a^2",
      "Independent of a."
    ],
    correctAnswer: "Proportional to 1/a"
  },
  {
    id: 8,
    question: "A charge q is moved in the electric field created by another charge Q. The work done in moving q from point A to point B depends on:",
    options: [
      "The path taken from A to B.",
      "Only the initial and final positions of q.",
      "The velocity of q during the motion.",
      "The distance between A and B but not on the charges involved."
    ],
    correctAnswer: "Only the initial and final positions of q."
  },
  {
    id: 9,
    question: "A uniformly charged ring with total charge Q and radius R is placed in the xy-plane with its center at the origin. The electric field on the z-axis at a distance z from the center is proportional to:",
    options: [
      "z / (z^2 + R^2)^(3/2)",
      "Q / (R^2 + z^2)",
      "R / z^2",
      "Q / (z^2 + R^2)^(1/2)"
    ],
    correctAnswer: "z / (z^2 + R^2)^(3/2)"
  },
  {
    id: 10,
    question: "A spherical shell of radius R carries a uniformly distributed surface charge. The electric field inside the shell at a point located a distance r from the center (where r < R) is:",
    options: [
      "Zero.",
      "Proportional to 1/r^2.",
      "Proportional to r / R^3.",
      "Uniform throughout the region."
    ],
    correctAnswer: "Zero."
  }

];

function Test() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes = 600 seconds
  const [showResultModal, setShowResultModal] = useState(false);
  const [score, setScore] = useState(0);
  const [studentName] = useState(""); // Replace with actual student name or pass as a prop
  const [isSubmitting, setIsSubmitting] = useState(false); // State to handle button loading


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
    setIsSubmitting(true)
    let newScore = 0;
    questions.forEach((q) => {
      const userAnswer = selectedAnswers[q.id];
      if (userAnswer === q.correctAnswer) {
        newScore += 4; // Correct answer
      } else {
        newScore -= 1; // Wrong answer
      }
    });
    setScore(newScore);
    setIsSubmitted(true);
    setShowResultModal(true);
    setIsSubmitting(false)
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleReview = () => {
    setShowResultModal(false);
  };

  return (
    <div className="test-container">
      <h1 className="test-heading">Test Page</h1>
      <div className="student-name">Student Name: {studentName}</div>
      <div className="timer">Time Left: {formatTime()}</div>

      {questions.map((q) => (
        <div key={q.id} className="question-container">
          <h3>{q.question}</h3>
          <div className="options-container">
            {q.options.map((option) => (
              <div key={option} className={`option ${isSubmitted && selectedAnswers[q.id] === option ? 'selected' : ''}`}>
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
        {isSubmitting ? 'Loading...' : 'Submit Test'} {/* Button shows loading state */}
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

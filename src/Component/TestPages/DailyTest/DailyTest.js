import React, { useState, useEffect, useCallback } from 'react';
import '../../../Style/DailyTest.css';

function DailyTest({ subject = "Physics", topics = ["Unit and Dimensions", "Kinematics 1D"] }) {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeTaken, setTimeTaken] = useState(0);

    const currentQuestion = questions[currentQuestionIndex];

    // Fetch questions from the backend
    const fetchTest = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:5000/student/generateDPP`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, topics })
            });
            const data = await response.json();
            setQuestions(data.questions);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    }, [subject, topics]);

    useEffect(() => {
        fetchTest();
    }, [fetchTest]);

    // Timer to track time taken
    useEffect(() => {
        if (isSubmitted) return;

        const timer = setInterval(() => {
            setTimeTaken(prevTime => prevTime + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isSubmitted]);

    // Handle answer selection
    const handleAnswerSelect = (answer) => {
        setSelectedAnswers(prevAnswers => ({
            ...prevAnswers,
            [currentQuestion.id]: answer
        }));
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            calculateScore();
        }
    };

    // Calculate score and handle submission
    const calculateScore = () => {
        let finalScore = 0;
        questions.forEach(q => {
            const selectedAnswer = selectedAnswers[q.id];
            if (selectedAnswer === q.correctAnswer) {
                finalScore += 4; // +4 for correct answers
            } else if (selectedAnswer) {
                finalScore -= 1; // -1 for wrong answers
            }
        });
        setScore(finalScore);
        setIsSubmitted(true);
    };

    // Restart quiz function
    const handleRestart = () => {
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setScore(0);
        setTimeTaken(0);
        setIsSubmitted(false);
        fetchTest();
    };

    return (
        <div className="quiz-container">
            <div className="timer">Time: {Math.floor(timeTaken / 60)}:{String(timeTaken % 60).padStart(2, '0')}</div>

            {!isSubmitted ? (
                currentQuestion ? (
                    <div className="question-card">
                        <h2>Question {currentQuestionIndex + 1}</h2>
                        <p dangerouslySetInnerHTML={{ __html: currentQuestion.question }}></p> {/* Renders HTML formatting */}
                        <div className="options-container">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`option ${selectedAnswers[currentQuestion.id] === option ? 'selected' : ''}`}
                                    onClick={() => handleAnswerSelect(option)}
                                    dangerouslySetInnerHTML={{ __html: option }} // Renders option HTML formatting
                                />
                            ))}
                        </div>
                        {currentQuestionIndex === questions.length - 1 && (
                            <button onClick={calculateScore} className="submit-button">Submit</button>
                        )}
                    </div>
                ) : (
                    <div>Loading questions...</div>
                )
            ) : (
                <div className="results-container">
                    <h2>Quiz Completed</h2>
                    <p>Your Score: {score}</p>
                    <button onClick={handleRestart} className="restart-button">Restart Quiz</button>

                    <div className="answers-container">
                        {questions.map((q, index) => (
                            <div
                                key={index}
                                className={`answer-card ${selectedAnswers[q.id] === q.correctAnswer ? 'correct' : selectedAnswers[q.id] ? 'incorrect' : 'unanswered'}`}
                            >
                                <h3>Question {index + 1}</h3>
                                <p dangerouslySetInnerHTML={{ __html: q.question }}></p>
                                <p><strong>Your Answer:</strong> {selectedAnswers[q.id] || 'Unanswered'}</p>
                                <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
                                <p><strong>Solution:</strong> {q.solution}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DailyTest;

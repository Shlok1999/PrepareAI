import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../../../Style/DailyTest.css';
import { account, databases } from '../../../appwrite/appwriteConfig';

function DailyTest({ subject = "Chemistry", topics = ["Mole Concept "] }) {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [explanations, setExplanations] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeTaken, setTimeTaken] = useState(0);

    // Get Student ID
    const [studentID, setStudentID] = useState('');
    useEffect(() => {
        const getStudentId = async () => {
            try {
                const response = await account.get();
                const id = response.$id;
                setStudentID(id);
                console.log(id);
            } catch (error) {
                console.log("Error: ", error);
            }
        };
        getStudentId();
    }, []);

    const currentQuestion = questions[currentQuestionIndex];

    const hasFetched = useRef(false); // Track if fetch has already happened

    // Fetch questions from the backend
    const fetchTest = useCallback(async () => {
        if (hasFetched.current) return; // Prevents multiple fetches
        hasFetched.current = true; // Mark fetch as done

        try {
            const response = await fetch(`http://localhost:5000/student/generateDPP`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, topics })
            });
            const data = await response.json();
            setQuestions(data.questions || []);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    }, [subject, topics]);

    useEffect(() => {
        fetchTest();
    }, [fetchTest]);

    // Handle answer selection
    const handleAnswerSelect = (answer) => {
        setSelectedAnswers(prevAnswers => ({
            ...prevAnswers,
            [currentQuestion.id]: answer
        }));
    };

    // Handle explanation input
    const handleExplanationInput = (explanation) => {
        setExplanations(prevExplanations => ({
            ...prevExplanations,
            [currentQuestion.id]: explanation
        }));
    };

    // Handle navigation to the next question
    const handleNext = () => {
        if (!selectedAnswers[currentQuestion.id] || !explanations[currentQuestion.id]) {
            alert('Please select an answer and provide an explanation before proceeding.');
            return;
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            calculateScore();
        }
    };

    // Calculate score and handle submission
    const calculateScore = () => {
        let finalScore = 0;

        questions.forEach((q) => {
            const selectedAnswer = selectedAnswers[q.id];

            if (selectedAnswer === q.correctAnswer) {
                finalScore += 4; // +4 for correct answers
            } else if (selectedAnswer !== undefined && selectedAnswer !== q.correctAnswer) {
                finalScore -= 1; // -1 for wrong answers
            }
        });

        setScore(finalScore);
        setIsSubmitted(true);
        saveTestResults(finalScore);
    };

    // Restart quiz function
    const handleRestart = () => {
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setExplanations({});
        setScore(0);
        setTimeTaken(0);
        setIsSubmitted(false);
        fetchTest();
    };

    // Save Daily Test to Appwrite
    const databaseId = process.env.REACT_APP_DATABASE_ID;
    const daily_test_collection = process.env.REACT_APP_DAILY_TEST_COLLECTION;

    const saveTestResults = async (finalScore) => {
        const testQuestionDetails = JSON.stringify(
            questions.map(q => ({
                question: q.question,
                selectedAnswers: selectedAnswers[q.id] || 'Unanswered',
                correctAnswer: q.correctAnswer,
                solution: q.solution,
                explanation: explanations[q.id] || 'No explanation provided'
            }))
        );

        try {
            await databases.createDocument(databaseId, daily_test_collection, 'unique()', {
                student_id: studentID,
                subject,
                topics,
                test_question_details: testQuestionDetails,
                marks: finalScore
            });

            console.log("Test results saved successfully...");
        } catch (error) {
            console.error("Error saving test results", error);
        }
    };

    return (
        <div className="quiz-container">
            <div className="timer">Time: {Math.floor(timeTaken / 60)}:{String(timeTaken % 60).padStart(2, '0')}</div>

            {!isSubmitted ? (
                currentQuestion ? (
                    <div className="question-card">
                        <h2>Question {currentQuestionIndex + 1}</h2>
                        <p dangerouslySetInnerHTML={{ __html: currentQuestion.question }}></p>
                        <div className="options-container">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`option ${selectedAnswers[currentQuestion.id] === option ? 'selected' : ''}`}
                                    onClick={() => handleAnswerSelect(option)}
                                    dangerouslySetInnerHTML={{ __html: option }}
                                />
                            ))}
                        </div>
                        <div className="explanation">
                            <input
                                placeholder="Explain your answer..."
                                value={explanations[currentQuestion.id] || ''}
                                onChange={(e) => handleExplanationInput(e.target.value)}
                            />
                        </div>
                        <button onClick={handleNext} className="next-button">
                            {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
                        </button>
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
                                <p><strong>Your Explanation:</strong> {explanations[q.id] || 'No explanation provided'}</p>
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

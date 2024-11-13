import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../../../Style/DailyTest.css';
import { account, databases } from '../../../appwrite/appwriteConfig';

function DailyTest({ subject = "Physics", topics = ["Unit and Dimensions", "Kinematics 1D"] }) {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeTaken, setTimeTaken] = useState(0);

    //Get Student ID
    const [studentID,setStudentID] = useState('');
    useEffect(()=>{
        const getStudentId = async()=>{
            try {
                const response = await account.get();
                const id = response.$id
                setStudentID(id);
                console.log(id);
            } catch (error) {
                console.log("Error: ",error);
            }
        }; 
        getStudentId();
    },[])

    const currentQuestion = questions[currentQuestionIndex];

    const hasFetched = useRef(false);//Track if fetch has already happened

    // Fetch questions from the backend
    const fetchTest = useCallback(async () => {
        if(hasFetched.current) return; //Prevents multiple fetches
        hasFetched.current = true; //Mark fetch as done

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
            
            // Log to debug the answers and score calculation
            console.log(`Question ID: ${q.id}, Selected: ${selectedAnswer}, Correct: ${q.correctAnswer}, Current Score: ${finalScore}`);
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
        setScore(0);
        setTimeTaken(0);
        setIsSubmitted(false);
        fetchTest();
    };

    //Save Daily Test to Appwrite
    let databaseId = process.env.REACT_APP_DATABASE_ID;
    let daily_test_collection = process.env.REACT_APP_DAILY_TEST_COLLECTION;


    const saveTestResults = async (finalScore)=>{
        const testQuestionDetails = JSON.stringify(
            questions.map(q=>({
                question: q.question,
                selectedAnswers: selectedAnswers[q.id] || 'Unanswered',
                correctAnswer: q.correctAnswer,
                solution: q.solution
            }))
        );

        try {
            await databases.createDocument(databaseId, daily_test_collection, 'unique()',{
                student_id: studentID,
                subject,
                topics,
                test_question_details: testQuestionDetails,
                marks: finalScore
            })

            console.log("Test results saved successfully...")
        } catch (error) {
            console.error("Error saving test results", error);
        }
    }

    



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
                {/* Render the question HTML */}
                <p dangerouslySetInnerHTML={{ __html: q.question }}></p>
                
                {/* Render the selected answer, handling "Unanswered" in plain text */}
                <p><strong>Your Answer:</strong> 
                    {selectedAnswers[q.id] ? (
                        <span dangerouslySetInnerHTML={{ __html: selectedAnswers[q.id] }}></span>
                    ) : (
                        'Unanswered'
                    )}
                </p>

                {/* Render the correct answer HTML */}
                <p><strong>Correct Answer:</strong> <span dangerouslySetInnerHTML={{ __html: q.correctAnswer }}></span></p>

                {/* Render the solution HTML */}
                <p><strong>Solution:</strong> <span dangerouslySetInnerHTML={{ __html: q.solution }}></span></p>
            </div>
        ))}
    </div>
                </div>
            )}
        </div>
    );
}

export default DailyTest;

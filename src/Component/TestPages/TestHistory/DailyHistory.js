import React, { useState, useEffect, useRef, useCallback } from 'react';
import { databases } from '../../../appwrite/appwriteConfig';
import '../../../Style/DailyHistory.css';

function DailyHistory() {
    const [tests, setTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);
    const hasFetched = useRef(false);



    const fetchDailyTests = useCallback(async () => {
        if (hasFetched.current) return;
        hasFetched.current = true
        try {
            const response = await databases.listDocuments(
                process.env.REACT_APP_DATABASE_ID,
                process.env.REACT_APP_DAILY_TEST_COLLECTION
            );
            const documents = response.documents.map(doc => ({
                ...doc,
                test_question_details: JSON.parse(doc.test_question_details) // Parse JSON string
            }));
            setTests(documents);
        } catch (error) {
            console.error("Error fetching daily tests:", error);
        }
    });
    useEffect(() => {
        fetchDailyTests();
    }, []);

    return (
        <div className="test-history-list">
            {tests.map((test) => (
                <div
                    key={test.$id}
                    className="test-item"
                    onClick={() => setSelectedTest(test)}
                >
                    <span>{new Date(test.$createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }).replace(/ /g, '-')}</span>
                    <span>{test.topics.join(', ')}</span>
                    <span>Score: {test.marks}/40</span>
                </div>
            ))}

            {selectedTest && (
                <div className="test-details">
                    <h3 style={{ textAlign: 'left' }}>Test Details</h3>
                    {selectedTest.test_question_details.map((q, index) => (
                        <div style={{ marginTop: '1rem' }} key={index} className="question-details">
                            <p>
                                <strong>Q{index + 1}:</strong>
                                <span dangerouslySetInnerHTML={{ __html: q.question }} />
                            </p>
                            <p>
                                <strong>Your Answer:</strong>
                                <span dangerouslySetInnerHTML={{ __html: q.selectedAnswer }} />
                            </p>
                            <p>
                                <strong>Correct Answer:</strong>
                                <span dangerouslySetInnerHTML={{ __html: q.correctAnswer }} />
                            </p>
                            <p>
                                <strong>Solution:</strong>
                                <span dangerouslySetInnerHTML={{ __html: q.solution }} />
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DailyHistory;

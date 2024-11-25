import React, { useState, useEffect } from 'react';
import '../../../Style/TestButtonsPage.css';
import { useNavigate } from 'react-router-dom';

const TestButtonsPage = () => {
  const [topicsData, setTopicsData] = useState({});
  const [completedTests, setCompletedTests] = useState({});
  const navigate = useNavigate();

  // Fetch topics from local storage
  const getTopicsFromLocalStorage = () => {
    const storedData = JSON.parse(localStorage.getItem('topics'));
    if (!storedData) return {};
    return storedData.data || {};
  };

  // Load topics on component mount
  useEffect(() => {
    const topics = getTopicsFromLocalStorage();
    setTopicsData(topics);

    // Initialize completed tests state
    const initialCompletedState = Object.keys(topics).reduce((acc, subject) => {
      acc[subject] = [];
      return acc;
    }, {});
    setCompletedTests(initialCompletedState);
  }, []);

  // Handle test navigation
  const handleTestClick = (subject, dayIndex) => {
    const topics = topicsData[subject] || [];
    navigate(`/test/dpp/${subject}/${encodeURIComponent(topics.join(','))}?day=${dayIndex}`);
  };

  // Handle test completion
  const handleTestCompletion = (subject, dayIndex) => {
    setCompletedTests((prevState) => {
      const updatedState = { ...prevState };
      updatedState[subject] = [...updatedState[subject], dayIndex];
      return updatedState;
    });

    // Save to local storage
    const storedState = JSON.parse(localStorage.getItem('completedTests')) || {};
    storedState[subject] = [...(storedState[subject] || []), dayIndex];
    localStorage.setItem('completedTests', JSON.stringify(storedState));
  };

  useEffect(() => {
    // Load completed tests from local storage
    const storedState = JSON.parse(localStorage.getItem('completedTests')) || {};
    setCompletedTests(storedState);
  }, []);

  return (
    <div className="test-buttons-container">
      <h2>Select Your Test</h2>
      <div className="button-container">
        {Object.keys(topicsData).map((subject, index) => (
          <div key={index} className="subject-container">
            <h3>{subject}</h3>
            <div className="test-links">
              {Array.from({ length: 5 }).map((_, dayIndex) => {
                const day = `Test ${dayIndex + 1}`;
                const isCompleted = completedTests[subject]?.includes(dayIndex + 1);

                return (
                  <div className="test-button-wrapper" key={dayIndex}>
                    <button
                      className={`test-link-button ${isCompleted ? 'completed' : ''}`}
                      onClick={() => handleTestClick(subject, dayIndex + 1)}
                    >
                      {day}
                    </button>
                    <div className="topics-hover">
                      <p>{topicsData[subject]?.join(', ')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestButtonsPage;

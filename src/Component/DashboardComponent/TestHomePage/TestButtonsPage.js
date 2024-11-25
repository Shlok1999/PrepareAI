import React, { useState, useEffect } from 'react';
import '../../../Style/TestButtonsPage.css';
import { useNavigate } from 'react-router-dom';

const TestButtonsPage = () => {
  const [topicsData, setTopicsData] = useState({});
  const [expandedSubject, setExpandedSubject] = useState(null); // Track which dropdown is open
  const navigate = useNavigate();

  // Fetch topics from local storage
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('topics'));
    if (storedData && storedData.data) {
      setTopicsData(storedData.data);
    }
  }, []);

  // Handle test navigation
  const handleTestClick = (subject) => {
    const topics = topicsData[subject]?.join(',') || '';
    navigate(`/test/dpp/${subject}/${encodeURIComponent(topics)}`);
  };

  // Toggle dropdown for a subject
  const toggleDropdown = (subject) => {
    setExpandedSubject((prev) => (prev === subject ? null : subject));
  };

  return (
    <div className="test-buttons-container">
      <h2>Select Your Test</h2>
      <div className="dropdown-container">
        {Object.keys(topicsData).map((subject, index) => (
          <div key={index} className="dropdown-item">
            <div
              className={`dropdown-header ${expandedSubject === subject ? 'expanded' : ''}`}
              onClick={() => toggleDropdown(subject)}
            >
              {subject}
            </div>
            {expandedSubject === subject && (
              <div className="test-links">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <button
                    key={idx}
                    className="test-link-button"
                    onClick={() => handleTestClick(subject)}
                  >
                    Test {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestButtonsPage;

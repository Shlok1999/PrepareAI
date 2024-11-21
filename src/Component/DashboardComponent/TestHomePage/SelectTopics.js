import React, { useState, useEffect } from 'react';
import './TestContent.css'; // Add your custom CSS here
import { useNavigate } from 'react-router-dom';

function SelectTopics() {
  const [selectedTopics, setSelectedTopics] = useState({});
  const maxChapters = 3;

  const subjects = {
    Physics: ["Units and Dimensions", "Motion in a straight line","Motion in a plane", "Work and Energy", "Laws of Motion"],
    Chemistry: ["Some Basic Concepts Of Chemistry", "Structure Of Atom", "Classification of Elements and Periodicity", "Chemical Bonding"],
    Biology:["The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom"],
    Math: ["Algebra", "Trigonometry", "Calculus", "Probability"],
  };

  const handleTopicClick = (subject, topic) => {
    setSelectedTopics((prev) => {
      const currentSelection = prev[subject] || [];

      if (currentSelection.includes(topic)) {
        // If topic is already selected, deselect it
        return { ...prev, [subject]: currentSelection.filter((t) => t !== topic) };
      }

      if (currentSelection.length < maxChapters) {
        // If selection limit not reached, add topic
        return { ...prev, [subject]: [...currentSelection, topic] };
      }

      return prev; // Do nothing if limit is reached
    });
  };

  let STORAGE_KEY = "topics";
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (storedData) {
      const { data, timestamp } = storedData;
      const now = new Date().getTime();

      // Check if data is older than 7 days
      if (now - timestamp < 7 * 24 * 60 * 60 * 1000) {
        setSelectedTopics(data);
      } else {
        localStorage.removeItem(STORAGE_KEY); // Clear expired data
      }
    }
  }, []);


  const handleSubmit = () => {
    const dataToSave = {
      data: selectedTopics,
      timestamp: new Date().getTime(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    alert("Selected topics have been saved for 7 days!");
  };

  return (
    <div className="test-content-container">
      <h2>Select upto 3 chapters per subject</h2>
      <div className="subjects-container">
        {Object.entries(subjects).map(([subject, chapters]) => (
          <div key={subject} className="subject-section">
            <h3 style={{marginBottom: '1rem'}}>{subject}</h3>
            <div className="chapters-container">
              {chapters.map((chapter) => (
                <div
                  key={chapter}
                  className={`chapter-box ${
                    selectedTopics[subject]?.includes(chapter) ? "selected" : ""
                  }`}
                  onClick={() => handleTopicClick(subject, chapter)}
                >
                  {chapter}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={Object.values(selectedTopics).some((topics) => topics.length === 0)}
      >
        Submit
      </button>
    </div>
  );
}

export default SelectTopics;

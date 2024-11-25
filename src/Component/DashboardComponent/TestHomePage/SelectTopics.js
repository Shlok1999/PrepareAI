import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './TestContent.css';

function SelectTopics() {
  const [selectedTopics, setSelectedTopics] = useState({});
  const maxChapters = 3;

  const subjects = {
    Physics: ["Units and Dimensions", "Motion in a straight line", "Motion in a plane", "Work and Energy", "Laws of Motion"],
    Chemistry: ["Some Basic Concepts Of Chemistry", "Structure Of Atom", "Classification of Elements and Periodicity", "Chemical Bonding"],
    Biology: ["The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom"],
    Math: ["Sets", "Relations and Functions", "Trignometric functions"],
  };

  const formatOptions = (topics) =>
    topics.map((topic) => ({ value: topic, label: topic }));

  const handleTopicChange = (subject, selectedOptions) => {
    const topics = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setSelectedTopics((prev) => ({ ...prev, [subject]: topics }));
  };

  const STORAGE_KEY = "topics";
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (storedData) {
      const { data, timestamp } = storedData;
      const now = Date.now();
      // Check if data is within 7 days
      if (now - timestamp < 7 * 24 * 60 * 60 * 1000) {
        setSelectedTopics(data);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const handleSubmit = () => {
    const dataToSave = {
      data: selectedTopics,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    alert("Topics saved for 7 days!");
    window.location.reload('/dashboard')
  };

  return (
    <div className="test-content-container">
      <h2 className="title">Select up to 3 chapters per subject</h2>
      <div className="subjects-container">
        {Object.entries(subjects).map(([subject, chapters]) => (
          <div key={subject} className="subject-section">
            <h3 className="subject-title">{subject}</h3>
            <Select
              isMulti
              options={formatOptions(chapters)}
              value={selectedTopics[subject]?.map((topic) => ({
                value: topic,
                label: topic,
              }))}
              onChange={(selectedOptions) => handleTopicChange(subject, selectedOptions)}
              placeholder={`Select up to ${maxChapters} chapters`}
              closeMenuOnSelect={false}
              isOptionDisabled={() => selectedTopics[subject]?.length >= maxChapters}
            />
          </div>
        ))}
      </div>
      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={Object.values(selectedTopics).some((topics) => topics.length === 0)}
      >
        Save Topics
      </button>
    </div>
  );
}

export default SelectTopics;

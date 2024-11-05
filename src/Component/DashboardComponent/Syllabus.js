import React, { useEffect, useState } from 'react';
import { account } from '../../appwrite/appwriteConfig';
import '../../Style/Syllabus.css'; // Add custom CSS for loader and syllabus

function Syllabus() {

  const studentCollection = process.env.REACT_APP_STUDENT_COLL_ID;
  const dbId = process.env.REACT_APP_DATABASE_ID

  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null); // State to store selected subject
  const exam = 'IIT-JEE';
  const month_left = 12;

  // Fetch syllabus data
  const fetchSyllabus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/student/syllabus?exam=${exam}&month_left=${month_left}`);
      if (!response.ok) {
        throw new Error("Failed to fetch syllabus");
      }
      const data = await response.json();
      setSyllabus(data.syllabus);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabus();
  }, []);

  // Get subjects from the first week's data
  const subjects = syllabus.length > 0 ? Object.keys(syllabus[0]).filter(key => key !== 'week' && key !== 'month') : [];

  // Handle subject card click
  const handleCardClick = (subject) => {
    setSelectedSubject(subject);
  };

  if (loading) {
    // Loader display during fetch
    return (
      <div className="loader-container">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="loader-card"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="syllabus-container">
      {!selectedSubject ? (
        <div className="subject-card-container">
          {subjects.map((subject, index) => (
            <div key={index} className="subject-card" onClick={() => handleCardClick(subject)}>
              <img src={`https://img.icons8.com/physics`} alt={subject} className="subject-logo" />
              <h3>{subject}</h3>
            </div>
          ))}
        </div>
      ) : (
        <div className="subject-syllabus-container">
          <h2>{selectedSubject} - Monthly Syllabus</h2>
          {syllabus.map((weekData, index) => (
            <div key={index} className="monthly-syllabus">
              <h3>Month {index+1}</h3>
              {weekData[selectedSubject].map((topic, topicIndex) => (
                <div key={topicIndex} className="syllabus-topic">
                  <span>{topic}</span>
                  <a href={`#`} className="test-link">Go To Test</a> {/* Link to the test page or route */}
                </div>
              ))}
            </div>
          ))}
          <button className="back-button" onClick={() => setSelectedSubject(null)}>Back to Subjects</button>
        </div>
      )}
    </div>
  );
}

export default Syllabus;

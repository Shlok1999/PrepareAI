import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { account, databases } from '../../appwrite/appwriteConfig';
import '../../Style/Syllabus.css';
import { Query } from 'appwrite';

function Syllabus() {
  const studentCollection = process.env.REACT_APP_STUDENT_COLL_ID;
  const dbId = process.env.REACT_APP_DATABASE_ID;
  const [exam,setExam] = useState('');
  const [monthLeft, setMonthLeft] = useState(8);
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // const exam = 'IIT-JEE';
  // const month_left = 12;

  const hasFetched = useRef(false);


  const fetchOrGenerateSyllabus = useCallback(async () => {
    if(hasFetched.current) return;
    hasFetched.current = true;
    try {
      const user = await account.get();
      const userEmail = user.email;

      const studentDoc = await databases.listDocuments(dbId, studentCollection, [
        Query.equal('email', userEmail)
      ]);

      if (studentDoc.documents.length > 0) {
        const documentId = studentDoc.documents[0].$id;
        const existingSyllabus = studentDoc.documents[0].syllabus;
        const exam_taken = studentDoc.documents[0].exam;
        console.log(exam_taken);

        setExam(exam_taken);
        console.log(exam)

        if (existingSyllabus) {
          setSyllabus(JSON.parse(existingSyllabus)); // Parse JSON when retrieving it
        } else {
          const response = await fetch(`http://localhost:5000/student/syllabus?exam=${exam_taken}&month_left=${monthLeft}`);
          if (!response.ok) throw new Error("Failed to fetch syllabus");

          const data = await response.json();
          setSyllabus(data.syllabus);

          // Save the JSON syllabus as a string in Appwrite
          await databases.updateDocument(dbId, studentCollection, documentId, {
            syllabus: JSON.stringify(data.syllabus) // Stringify JSON before saving
          });

          console.log("Syllabus saved to student collection");
        }
      } else {
        throw new Error("Student document not found.");
      }
      console.log(exam)
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchOrGenerateSyllabus();
  }, [exam, monthLeft]);

  const subjects = syllabus.length > 0 ? Object.keys(syllabus[0]).filter(key => key !== 'week' && key !== 'month') : [];

  const handleCardClick = (subject) => {
    setSelectedSubject(subject);
  };

  if (loading) {
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
              <h3>Month {index + 1}</h3>
              {weekData[selectedSubject].map((topic, topicIndex) => (
                <div key={topicIndex} className="syllabus-topic">
                  <Link style={{textDecoration: 'none', color:'black', fontWeight: 'bold'}} to={`/topics/${encodeURIComponent(topic)}`} className='topic-link'>
                    <span>{topic}</span>
                  </Link>
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

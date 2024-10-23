import React, { useEffect, useState } from 'react'

function Syllabus() {
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSyllabus = async () => {
    const exam = 'IIT-JEE'
    const month_left = 7
    try {
      const response = await fetch(`http://localhost:5000/student/syllabus?exam=${exam}&month_left=${month_left}`)
      if(!response.ok){
        throw new Error("Failed to fetch Syllabus")
      }
      const data = await response.json();
      setSyllabus(data.syllabus);
      setLoading(false)
    } catch (error) {
      setError(error.message)
      setLoading(false);
      console.log(error)
    }
  };

  useEffect(() => {
    fetchSyllabus();
  },[])
  console.log(syllabus[0])

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Syllabus</h1>
      {syllabus.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Week</th>
              <th>Subject 1</th>
              <th>Subject 2</th>
              <th>Subject 3</th>
            </tr>
          </thead>
          <tbody>
            {syllabus.map((weekData, index) => (
              <tr key={index}>
                <td>{weekData.week}</td>
                <td>{weekData[Object.keys(weekData)[1]].join(', ')}</td>
                <td>{weekData[Object.keys(weekData)[2]].join(', ')}</td>
                <td>{weekData[Object.keys(weekData)[3]].join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading syllabus...</p>
      )}
    </div>
  )
}

export default Syllabus
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { account, databases } from '../../appwrite/appwriteConfig';
import '../../Style/Syllabus.css';
import { Query } from 'appwrite';

function Syllabus() {
  // const studentCollection = process.env.REACT_APP_STUDENT_COLL_ID;
  // const dbId = process.env.REACT_APP_DATABASE_ID;
  // const [exam,setExam] = useState('');
  // const [monthLeft, setMonthLeft] = useState(8);
  // const [syllabus, setSyllabus] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // const exam = 'IIT-JEE';
  // const month_left = 12;

  const hasFetched = useRef(false);
  const staticSyllabus = [
    {
      "month": 1,
      "Physics": [
        "Units and Measurements",
        "Motion in a Straight Line",
        "Motion in a Plane",
        "Laws of Motion",
        "Work, Energy, and Power"
      ],
      "Chemistry": [
        "Some Basic Concepts of Chemistry",
        "Structure of Atom",
        "Classification of Elements and Periodicity in Properties",
        "Chemical Bonding and Molecular Structure",
        "States of Matter: Gases and Liquids"
      ],
      "Biology": [
        "The Living World",
        "Biological Classification",
        "Plant Kingdom",
        "Animal Kingdom",
        "Morphology of Flowering Plants"
      ],
      "Mathematics": [
        "Sets",
        "Relations and Functions",
        "Trigonometric Functions",
        "Principle of Mathematical Induction",
        "Complex Numbers and Quadratic Equations"
      ]
    },
    {
      "month": 2,
      "Physics": [
        "System of Particles and Rotational Motion",
        "Gravitation",
        "Mechanical Properties of Solids",
        "Mechanical Properties of Fluids",
        "Thermal Properties of Matter"
      ],
      "Chemistry": [
        "Thermodynamics",
        "Equilibrium",
        "Redox Reactions",
        "Hydrogen",
        "s-Block Elements"
      ],
      "Biology": [
        "Anatomy of Flowering Plants",
        "Structural Organisation in Animals",
        "Cell: The Unit of Life",
        "Biomolecules",
        "Cell Cycle and Cell Division"
      ],
      "Mathematics": [
        "Linear Inequalities",
        "Permutations and Combinations",
        "Binomial Theorem",
        "Sequence and Series",
        "Straight Lines"
      ]
    },
    {
      "month": 3,
      "Physics": [
        "Thermodynamics",
        "Kinetic Theory",
        "Oscillations",
        "Waves",
        "Ray Optics"
      ],
      "Chemistry": [
        "p-Block Elements",
        "Organic Chemistry - Some Basic Principles and Techniques",
        "Hydrocarbons",
        "Environmental Chemistry",
        "Solid State"
      ],
      "Biology": [
        "Transport in Plants",
        "Mineral Nutrition",
        "Photosynthesis in Higher Plants",
        "Respiration in Plants",
        "Plant Growth and Development"
      ],
      "Mathematics": [
        "Conic Sections",
        "Introduction to Three Dimensional Geometry",
        "Limits and Derivatives",
        "Mathematical Reasoning",
        "Statistics"
      ]
    },
    {
      "month": 4,
      "Physics": [
        "Wave Optics",
        "Dual Nature of Radiation and Matter",
        "Atoms",
        "Nuclei",
        "Semiconductor Electronics"
      ],
      "Chemistry": [
        "Solutions",
        "Electrochemistry",
        "Chemical Kinetics",
        "Surface Chemistry",
        "General Principles and Processes of Isolation of Elements"
      ],
      "Biology": [
        "Digestion and Absorption",
        "Breathing and Exchange of Gases",
        "Body Fluids and Circulation",
        "Excretory Products and their Elimination",
        "Locomotion and Movement"
      ],
      "Mathematics": [
        "Probability",
        "Relations and Functions Revision",
        "Trigonometric Functions Revision",
        "Linear Inequalities Revision",
        "Conic Sections Revision"
      ]
    },
    {
      "month": 5,
      "Physics": [
        "Electrostatics",
        "Current Electricity",
        "Magnetic Effects of Current and Magnetism",
        "Electromagnetic Induction",
        "Alternating Current"
      ],
      "Chemistry": [
        "p-Block Elements Revision",
        "Coordination Compounds",
        "Haloalkanes and Haloarenes",
        "Alcohols, Phenols and Ethers",
        "Aldehydes, Ketones and Carboxylic Acids"
      ],
      "Biology": [
        "Neural Control and Coordination",
        "Chemical Coordination and Integration",
        "Sexual Reproduction in Flowering Plants",
        "Human Reproduction",
        "Reproductive Health"
      ],
      "Mathematics": [
        "Limits and Derivatives Revision",
        "Principle of Mathematical Induction Revision",
        "Complex Numbers and Quadratic Equations Revision",
        "Binomial Theorem Revision",
        "Sequence and Series Revision"
      ]
    },
    {
      "month": 6,
      "Physics": [
        "Electromagnetic Waves",
        "Revision of Mechanics",
        "Revision of Heat and Thermodynamics",
        "Revision of Optics",
        "Revision of Modern Physics"
      ],
      "Chemistry": [
        "d and f Block Elements",
        "Amines",
        "Biomolecules",
        "Polymers",
        "Chemistry in Everyday Life"
      ],
      "Biology": [
        "Principles of Inheritance and Variation",
        "Molecular Basis of Inheritance",
        "Evolution",
        "Human Health and Disease",
        "Strategies for Enhancement in Food Production"
      ],
      "Mathematics": [
        "Straight Lines Revision",
        "Three Dimensional Geometry Revision",
        "Mathematical Reasoning Revision",
        "Statistics Revision",
        "Probability Revision"
      ]
    },
    {
      "month": 7,
      "Physics": [
        "Full Syllabus Revision - Part 1 (Mechanics, Heat & Thermo, Waves)"
      ],
      "Chemistry": [
        "Full Syllabus Revision- Part 1 (Physical Chemistry)"
      ],
      "Biology": [
        "Full Syllabus Revision - Part 1 (Botany)"
      ],
      "Mathematics": [
        "Full Syllabus Revision -Calculus"
      ]
    },
    {
      "month": 8,
      "Physics": [
        "Full Syllabus Revision - Part 2 (Optics, Modern Physics, Electricity and Magnetism)"
      ],
      "Chemistry": [
        "Full Syllabus Revision - Part 2 (Inorganic & Organic Chemistry)"
      ],
      "Biology": [
        "Full Syllabus Revision - Part 2 (Zoology & Genetics & Evolution & Ecology )"
      ],
      "Mathematics": [
        "Full Syllabus Revision - Algebra, Coordinate Geometry and Probability"
      ]
    }
  ]


  // const fetchOrGenerateSyllabus = useCallback(async () => {
  //   if(hasFetched.current) return;
  //   hasFetched.current = true;
  //   try {
  //     const user = await account.get();
  //     const userEmail = user.email;

  //     const studentDoc = await databases.listDocuments(dbId, studentCollection, [
  //       Query.equal('email', userEmail)
  //     ]);

  //     if (studentDoc.documents.length > 0) {
  //       const documentId = studentDoc.documents[0].$id;
  //       const existingSyllabus = studentDoc.documents[0].syllabus;
  //       const exam_taken = studentDoc.documents[0].exam;
  //       console.log(exam_taken);

  //       setExam(exam_taken);
  //       console.log(existingSyllabus)

  //       if (existingSyllabus) {
  //         setSyllabus(JSON.parse(existingSyllabus)); // Parse JSON when retrieving it
  //       } else {
  //         const response = await fetch(`http://localhost:5000/student/syllabus?exam=${exam_taken}&month_left=${monthLeft}`);
  //         if (!response.ok) throw new Error("Failed to fetch syllabus");

  //         const data = await response.json();
  //         setSyllabus(data.syllabus);

  //         // Save the JSON syllabus as a string in Appwrite
  //         await databases.updateDocument(dbId, studentCollection, documentId, {
  //           syllabus: JSON.stringify(data.syllabus) // Stringify JSON before saving
  //         });

  //         console.log("Syllabus saved to student collection");
  //       }
  //     } else {
  //       throw new Error("Student document not found.");
  //     }
  //     console.log(exam)
  //     setLoading(false);
  //   } catch (error) {
  //     setError(error.message);
  //     setLoading(false);
  //   }
  // });

  // useEffect(() => {
  //   fetchOrGenerateSyllabus();
  // }, [exam, monthLeft]);

  // const subjects = syllabus.length > 0 ? Object.keys(syllabus[0]).filter(key => key !== 'week' && key !== 'month') : [];

  // const handleCardClick = (subject) => {
  //   setSelectedSubject(subject);
  // };

  // if (loading) {
  //   return (
  //     <div className="loader-container">
  //       {[1, 2, 3].map((_, index) => (
  //         <div key={index} className="loader-card"></div>
  //       ))}
  //     </div>
  //   );
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  // return (
  //   <div className="syllabus-container">
  //     {!selectedSubject ? (
  //       <div className="subject-card-container">
  //         {subjects.map((subject, index) => (
  //           <div key={index} className="subject-card" onClick={() => handleCardClick(subject)}>
  //             <img src={`https://img.icons8.com/physics`} alt={subject} className="subject-logo" />
  //             <h3>{subject}</h3>
  //           </div>
  //         ))}
  //       </div>
  //     ) : (
  //       <div className="subject-syllabus-container">
  //         <h2>{selectedSubject} - Monthly Syllabus</h2>
  //         {syllabus.map((weekData, index) => (
  //           <div key={index} className="monthly-syllabus">
  //             <h3>Month {index + 1}</h3>
  //             {weekData[selectedSubject].map((topic, topicIndex) => (
  //               <div key={topicIndex} className="syllabus-topic">
  //                 <Link style={{textDecoration: 'none', color:'black', fontWeight: 'bold'}} to={`/topics/${encodeURIComponent(topic)}`} className='topic-link'>
  //                   <span>{topic}</span>
  //                 </Link>
  //               </div>
  //             ))}
  //           </div>
  //         ))}
  //         <button className="back-button" onClick={() => setSelectedSubject(null)}>Back to Subjects</button>
  //       </div>
  //     )}
  //   </div>
  
  // );

  const subjects = staticSyllabus.length > 0
    ? Object.keys(staticSyllabus[0]).filter((key) => key !== 'month')
    : [];

  const handleCardClick = (subject) => {
    setSelectedSubject(subject);
  };
  return(
    <div className="syllabus-container">
      {!selectedSubject ? (
        <div className="subject-card-container">
          {subjects.map((subject, index) => (
            <div
              key={index}
              className="subject-card"
              onClick={() => handleCardClick(subject)}
            >
              <img
                src={`https://img.icons8.com/physics`}
                alt={subject}
                className="subject-logo"
              />
              <h3>{subject}</h3>
            </div>
          ))}
        </div>
      ) : (
        <div className="subject-syllabus-container">
          <h2>{selectedSubject} - Monthly Syllabus</h2>
          {staticSyllabus.map((monthData, index) => (
            <div key={index} className="monthly-syllabus">
              <h3>Month {monthData.month}</h3>
              {monthData[selectedSubject].map((topic, topicIndex) => (
                <div key={topicIndex} className="syllabus-topic">
                  <Link
                    style={{
                      textDecoration: 'none',
                      color: 'black',
                      fontWeight: 'bold'
                    }}
                    to={`/topics/${encodeURIComponent(topic)}`}
                    className="topic-link"
                  >
                    <span>{topic}</span>
                  </Link>
                </div>
              ))}
            </div>
          ))}
          <button
            className="back-button"
            onClick={() => setSelectedSubject(null)}
          >
            Back to Subjects
          </button>
        </div>
      )}
    </div>
  )
}

export default Syllabus;

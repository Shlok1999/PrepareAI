const questionData = [
  {
      "id": 1,
      "question": "A physical quantity has dimensions [M][L^2][T^–3]. The quantity is most likely to be:",
      "options": ["Energy", "Power", "Pressure", "Force"],
      "subject": "Physics",
      "topic": ["Units and Dimensions", "Dimensional Analysis"],
      "levelOfQuestion": "medium",
      "solution": "Power has the dimensions [M L^2 T^–3], hence the correct answer is Power."
  },
  {
      "id": 2,
      "question": "A vector has components 3i, 4j, and 5k. The magnitude of the vector is:",
      "options": ["5", "7", "√50", "√20"],
      "subject": "Physics",
      "topic": ["Vectors", "Magnitude of a vector"],
      "levelOfQuestion": "easy",
      "solution": "The magnitude of a vector A = √(3^2 + 4^2 + 5^2) = √(9+16+25) = √50 ≈ 7.07."
  },
  {
      "id": 3,
      "question": "If the acceleration of an object is constant, which of the following is true?",
      "options": [
          "The object is moving at a constant velocity",
          "The object’s velocity is changing at a constant rate",
          "The object’s speed is decreasing",
          "The object is not moving"
      ],
      "subject": "Physics",
      "topic": ["Motion in a Straight Line", "Kinematics"],
      "levelOfQuestion": "easy",
      "solution": "For constant acceleration, the object's velocity changes at a constant rate, so the correct answer is: 'The object’s velocity is changing at a constant rate'."
  },
  {
      "id": 4,
      "question": "If an object is moving with a constant velocity, the net force acting on it must be:",
      "options": ["Zero", "Constant", "Increasing", "Decreasing"],
      "subject": "Physics",
      "topic": ["Newton's Laws of Motion", "Force and Motion"],
      "levelOfQuestion": "easy",
      "solution": "An object moving with constant velocity experiences zero net force according to Newton's First Law."
  },
  {
      "id": 5,
      "question": "Which of the following quantities has no units?",
      "options": ["Work", "Force", "Strain", "Pressure"],
      "subject": "Physics",
      "topic": ["Units and Dimensions", "Unitless Quantities"],
      "levelOfQuestion": "medium",
      "solution": "Strain is a ratio of lengths and hence dimensionless, meaning it has no units."
  },
  {
      "id": 6,
      "question": "How many moles of oxygen atoms are present in 1 mole of H₂SO₄?",
      "options": ["1 mole", "2 moles", "4 moles", "5 moles"],
      "subject": "Chemistry",
      "topic": ["Basic Concepts of Chemistry", "Moles and Molecules"],
      "levelOfQuestion": "easy",
      "solution": "There are 4 oxygen atoms in H₂SO₄, so there are 4 moles of oxygen atoms in 1 mole of H₂SO₄."
  },
  {
      "id": 7,
      "question": "The atomic number of an element is 11. Its electronic configuration is:",
      "options": ["1s² 2s² 2p⁶ 3s²", "1s² 2s² 2p⁶ 3s¹", "1s² 2s² 2p⁵ 3s²", "1s² 2s² 2p⁶ 3p¹"],
      "subject": "Chemistry",
      "topic": ["Atomic Structure", "Electronic Configuration"],
      "levelOfQuestion": "easy",
      "solution": "For atomic number 11, the correct electronic configuration is 1s² 2s² 2p⁶ 3s¹ (Sodium)."
  },
  {
      "id": 8,
      "question": "Which of the following statements is correct according to Dalton's atomic theory?",
      "options": [
          "Atoms can be divided into protons and neutrons",
          "Atoms of the same element are identical in mass and properties",
          "Atoms can be destroyed in chemical reactions",
          "Compounds are formed by the creation of new atoms"
      ],
      "subject": "Chemistry",
      "topic": ["Basic Concepts of Chemistry", "Dalton's Atomic Theory"],
      "levelOfQuestion": "medium",
      "solution": "Dalton proposed that atoms of the same element are identical in mass and properties, which is the correct answer."
  },
  {
      "id": 9,
      "question": "The number of significant figures in 0.00250 is:",
      "options": ["2", "3", "4", "5"],
      "subject": "Chemistry",
      "topic": ["Basic Concepts of Chemistry", "Significant Figures"],
      "levelOfQuestion": "easy",
      "solution": "0.00250 has 3 significant figures because trailing zeros after the decimal are significant."
  },
  {
      "id": 10,
      "question": "The molecular weight of H₂SO₄ is:",
      "options": ["98 g/mol", "96 g/mol", "102 g/mol", "100 g/mol"],
      "subject": "Chemistry",
      "topic": ["Basic Concepts of Chemistry", "Molecular Mass"],
      "levelOfQuestion": "easy",
      "solution": "Molecular weight of H₂SO₄ = (2x1) + (32x1) + (4x16) = 98 g/mol."
  },
  {
      "id": 11,
      "question": "The solution set of the equation |x - 3| = 5 is:",
      "options": ["x = 8", "x = -2", "x = -8", "x = 2, 8"],
      "subject": "Mathematics",
      "topic": ["Sets, Relations and Functions", "Absolute Values"],
      "levelOfQuestion": "easy",
      "solution": "The solution to |x - 3| = 5 gives two solutions: x - 3 = 5 or x - 3 = -5. Hence, x = 8 or x = -2."
  },
  {
      "id": 12,
      "question": "If A = {1, 2, 3, 4} and B = {2, 3, 5}, then A ∩ B is:",
      "options": ["{1, 2, 3, 4, 5}", "{2, 3}", "{1, 4, 5}", "{1, 2, 4}"],
      "subject": "Mathematics",
      "topic": ["Sets, Relations and Functions", "Intersection of Sets"],
      "levelOfQuestion": "easy",
      "solution": "A ∩ B represents the intersection of sets A and B, which is {2, 3}."
  },
  {
      "id": 13,
      "question": "Which of the following is a purely imaginary number?",
      "options": ["2 + i", "i", "-2i", "-1"],
      "subject": "Mathematics",
      "topic": ["Complex Numbers", "Pure Imaginary Numbers"],
      "levelOfQuestion": "medium",
      "solution": "-2i is a purely imaginary number as it has no real part."
  },
  {
      "id": 14,
      "question": "The value of i² (where i is the imaginary unit) is:",
      "options": ["1", "-1", "0", "i"],
      "subject": "Mathematics",
      "topic": ["Complex Numbers", "Powers of i"],
      "levelOfQuestion": "easy",
      "solution": "By definition, i² = -1."
  },
  {
      "id": 15,
      "question": "The quadratic equation whose roots are 2 and -3 is:",
      "options": ["x² + x - 6 = 0", "x² - x + 6 = 0", "x² - x - 6 = 0", "x² + x + 6 = 0"],
      "subject": "Mathematics",
      "topic": ["Quadratic Equations", "Finding Equation from Roots"],
      "levelOfQuestion": "medium",
      "solution": "The quadratic equation with roots 2 and -3 is (x - 2)(x + 3) = 0, which simplifies to x² + x - 6 = 0."
  }
]

  export default questionData
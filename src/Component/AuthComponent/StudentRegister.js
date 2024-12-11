import React, { useState } from 'react';
import { account, databases } from '../../appwrite/appwriteConfig';

function StudentRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [classLevel, setClassLevel] = useState('11');
  const [exam, setExam] = useState('IIT-JEE');
  const [examYear, setExamYear] = useState(2024);
  const [parentPhone, setParentPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userResponse = await account.create('unique()', email, password, name);
      setSuccessMessage('Registration successful!');

      try {
        const userInDb = await databases.createDocument(
          process.env.REACT_APP_DATABASE_ID,
          process.env.REACT_APP_STUDENT_COLL_ID,
          'unique()',
          {
            name,
            email,
            password,
            phone,
            classLevel,
            exam,
            exam_year: examYear,
            parent_phone: parentPhone,
          }
        );

        if (userInDb) {
          setSuccessMessage('Student registered successfully!');
        }
      } catch (dbError) {
        setErrorMessage('Failed to save student details in the database.');
        console.error('Database error:', dbError);
      }
    } catch (error) {
      setErrorMessage('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="loader"></div>
        </div>
      )}

      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8 mt-0 mb-10">
        <h2 className="text-3xl font-bold text-center text-gray-800">Student Registration</h2>
        <p className="text-center text-gray-600 mb-6">
          Register now and start your journey to success!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Create a password"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Class</label>
            <select
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="11">11th</option>
              <option value="12">12th</option>
              <option value="repeater">Repeater</option>
            </select>
          </div>

          {/* Exam */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Exam</label>
            <select
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="IIT-JEE">IIT-JEE</option>
              <option value="NEET">NEET</option>
            </select>
          </div>

          {/* Exam Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Exam Year</label>
            <select
              value={examYear}
              onChange={(e) => setExamYear(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          {/* Parent's Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Parent's Phone (Optional)</label>
            <input
              type="tel"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter parent's phone number"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Register
          </button>

          {/* Error and Success Messages */}
          {errorMessage && (
            <p className="text-red-500 text-center text-sm mt-2">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-center text-sm mt-2">{successMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default StudentRegister;

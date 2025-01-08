import React, { useState } from "react";
import { account, databases } from "../../appwrite/appwriteConfig";
import { Link } from "react-router-dom"

export default function StudentRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    classLevel: "11", 
    exam: "IIT-JEE",
    exam_year: 2024,
    parent_phone: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error message when user starts typing
    if (name === 'password') {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Check password length first
    if (formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const userResponse = await account.create(
        "unique()",
        formData.email,
        formData.password,
        formData.name,
        formData.phone,
        formData.parent_phone,
        formData.classLevel,
        formData.exam,
        formData.exam_year
      );

      try {
        await databases.createDocument(
          process.env.REACT_APP_DATABASE_ID,
          process.env.REACT_APP_STUDENT_COLL_ID,
          "unique()",
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            classLevel: formData.classLevel,
            exam: formData.exam,
            exam_year: formData.exam_year,
            parent_phone: formData.parent_phone,
          }
        );
        setSuccessMessage("Registration successful! Start your journey now.");
        window.location.href = "/" // Redirect to login page
      } catch (dbError) {
        setErrorMessage("Failed to save student details in the database.");
        console.error("Database error:", dbError);
      }

      console.log("User created:", userResponse);
    } catch (error) {
      setErrorMessage("Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of the component remains the same...
  const renderFormField = (
    label,
    name,
    type = "text",
    options = null,
    placeholder = ""
  ) => {
    const isError = Boolean(errorMessage && formData[name] === "");

    const inputClass =
      `mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm ` +
      `focus:ring-indigo-500 focus:border-indigo-500 ${isError ? "border-red-500" : "border-gray-300"
      }`;

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {options ? (
          <select
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className={inputClass}
          >
            {options.map((option, i) => (
              <option key={i} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            name={name}
            type={type}
            value={formData[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className={inputClass}
            required
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="loader"></div>
        </div>
      )}

      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">Student Registration</h2>
        <p className="text-center text-gray-600 mb-6">
          Register now and start your journey to success!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderFormField("Full Name", "name", "text", null, "Enter your full name")}
          {renderFormField("Email", "email", "email", null, "Enter your email")}
          {renderFormField("Password", "password", "password", null, "Create a password (min. 8 characters)")}
          {renderFormField("Phone Number", "phone", "tel", null, "Enter your phone number")}
          {renderFormField("Class", "classLevel", "select", [
            { value: "11", label: "Class 11" },
            { value: "12", label: "Class 12" },
            { value: "repeater", label: "Repeater" },
          ])}
          {renderFormField("Target Exam", "exam", "select", [
            { value: "IIT-JEE", label: "IIT-JEE" },
            { value: "NEET", label: "NEET" },
          ])}
          {renderFormField("Exam Year", "exam_year", "select", [
            { value: "2024", label: "2024" },
            { value: "2025", label: "2025" },
            { value: "2026", label: "2026" },
          ])}
          {renderFormField(
            "Parent's Phone Number",
            "parent_phone",
            "tel",
            null,
            "Enter parent's phone number"
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Register
          </button>

          {errorMessage && (
            <p className="text-red-500 text-center text-sm mt-2">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-center text-sm mt-2">{successMessage}</p>
          )}
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
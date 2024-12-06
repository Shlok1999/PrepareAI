import React, { useEffect, useState } from "react";
import {
  FaBook,
  FaClipboardList,
  FaUserCog,
  FaTools,
  FaTrophy,
  FaAngleLeft,
  FaAlignJustify,
} from "react-icons/fa";

function DashboardSidebar({ selectedSection, onSectionChange, isOpen, toggleSidebar }) {
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    const profile = JSON.parse(sessionStorage.getItem("profile")) || {
      name: "John Doe",
      picture: "https://via.placeholder.com/150",
      email: "johndoe@gmail.com",
    };
    setUserProfile(profile);
  }, []);

  const handleSectionClick = (section) => {
    onSectionChange(section);
    localStorage.setItem("selectedSection", section);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-indigo-700 text-white shadow-lg transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-indigo-600">
        {isOpen ? (
          <div className="flex items-center space-x-3">
            <img
              src={userProfile.picture}
              alt={userProfile.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">{userProfile.name}</p>
              <p className="text-xs text-indigo-300">{userProfile.email}</p>
            </div>
          </div>
        ) : (
          <img
            src={userProfile.picture}
            alt={userProfile.name}
            className="w-10 h-10 rounded-full"
          />
        )}
        <button
          onClick={toggleSidebar}
          className="text-indigo-300 hover:text-white focus:outline-none"
        >
          {isOpen ? <FaAngleLeft size={20} /> : <FaAlignJustify size={20} />}
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        <li
          className={`flex items-center px-4 py-3 cursor-pointer hover:bg-indigo-600 ${
            selectedSection === "syllabus" ? "bg-indigo-600" : ""
          }`}
          onClick={() => handleSectionClick("syllabus")}
        >
          <FaBook size={20} />
          {isOpen && <span className="ml-3">Syllabus</span>}
        </li>
        <li
          className={`flex items-center px-4 py-3 cursor-pointer hover:bg-indigo-600 ${
            selectedSection === "test" ? "bg-indigo-600" : ""
          }`}
          onClick={() => handleSectionClick("test")}
        >
          <FaClipboardList size={20} />
          {isOpen && <span className="ml-3">Go To Test</span>}
        </li>
        <li
          className={`flex items-center px-4 py-3 cursor-pointer hover:bg-indigo-600 ${
            selectedSection === "profileSettings" ? "bg-indigo-600" : ""
          }`}
          onClick={() => handleSectionClick("profileSettings")}
        >
          <FaUserCog size={20} />
          {isOpen && <span className="ml-3">Profile & Settings</span>}
        </li>
        <li
          className={`flex items-center px-4 py-3 cursor-pointer hover:bg-indigo-600 ${
            selectedSection === "resources" ? "bg-indigo-600" : ""
          }`}
          onClick={() => handleSectionClick("resources")}
        >
          <FaTools size={20} />
          {isOpen && <span className="ml-3">Study Resources</span>}
        </li>
        <li
          className={`flex items-center px-4 py-3 cursor-pointer hover:bg-indigo-600 ${
            selectedSection === "progress" ? "bg-indigo-600" : ""
          }`}
          onClick={() => handleSectionClick("progress")}
        >
          <FaTrophy size={20} />
          {isOpen && <span className="ml-3">Achievements & Progress</span>}
        </li>
      </ul>
    </div>
  );
}

export default DashboardSidebar;

import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import {
  FaBook,
  FaClipboardList,
  FaUserCog,
  FaTools,
  FaTrophy,
  FaAngleLeft,
  FaAlignJustify,
} from "react-icons/fa";

function DashboardSidebar({ selectedSection, onSectionChange }) {
  const [userProfile, setUserProfile] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const getUsername = async () => {
      try {
        const userProfile = JSON.parse(sessionStorage.getItem("profile"));
        setUserProfile(userProfile);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getUsername();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSectionClick = (section) => {
    onSectionChange(section);
    localStorage.setItem("selectedSection", section);
  };

  return (
    <div
      className={`dashboard-sidebar-container ${isOpen ? "open" : "collapsed"}`}
    >
      <div className="sidebar-content">
        <ul>
          <li className="userProfile">
            <Image src={userProfile.picture} alt={userProfile.name}></Image>
            <span>{userProfile.name}</span>
          </li>
          <li
            className={selectedSection === "syllabus" ? "active" : ""}
            onClick={() => handleSectionClick("syllabus")}
          >
            <FaBook /> <span>Syllabus</span>
          </li>
          <li
            className={selectedSection === "test" ? "active" : ""}
            onClick={() => handleSectionClick("test")}
          >
            <FaClipboardList /> <span>Go To Test</span>
          </li>
          <li
            className={selectedSection === "profileSettings" ? "active" : ""}
            onClick={() => handleSectionClick("profileSettings")}
          >
            <FaUserCog /> <span>Profile & Settings</span>
          </li>
          <li
            className={selectedSection === "resources" ? "active" : ""}
            onClick={() => handleSectionClick("resources")}
          >
            <FaTools /> <span>Study Resources</span>
          </li>
          <li
            className={selectedSection === "progress" ? "active" : ""}
            onClick={() => handleSectionClick("progress")}
          >
            <FaTrophy /> <span>Achievements & Progress</span>
          </li>
          <li className="sidebar-toggler">
            {isOpen ? (
              <FaAngleLeft onClick={toggleSidebar} />
            ) : (
              <FaAlignJustify onClick={toggleSidebar} />
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DashboardSidebar;

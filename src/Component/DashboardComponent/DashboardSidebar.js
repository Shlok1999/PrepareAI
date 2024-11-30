import React, { useEffect, useState } from 'react';
import '../../Style/DashboardSidebar.css';
import { FaBook, FaClipboardList, FaUserCog, FaTools, FaTrophy } from 'react-icons/fa';

function DashboardSidebar({ selectedSection, onSectionChange }) {
  const [userName, setUserName] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const getUsername = async () => {
      try {
        const userProfile = JSON.parse(sessionStorage.getItem("profile"));
        setUserName(userProfile.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getUsername();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSectionClick = (section) => {
    onSectionChange(section);
    localStorage.setItem('selectedSection', section);
  };

  return (
    <div className={`dashboard-sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <button className="menu-button" onClick={toggleSidebar}>
        {isOpen ? '←' : '☰'}
      </button>

      {isOpen && (
        <div className="sidebar-content">
          <ul>
            <li><strong>{userName}</strong></li>
            <li className={selectedSection === 'syllabus' ? 'active' : ''} onClick={() => handleSectionClick('syllabus')}><FaBook /> Syllabus</li>
            <li className={selectedSection === 'test' ? 'active' : ''} onClick={() => handleSectionClick('test')}><FaClipboardList /> Go To Test</li>
            <li className={selectedSection === 'profileSettings' ? 'active' : ''} onClick={() => handleSectionClick('profileSettings')}><FaUserCog /> Profile & Settings</li>
            <li className={selectedSection === 'resources' ? 'active' : ''} onClick={() => handleSectionClick('resources')}><FaTools /> Study Resources</li>
            <li className={selectedSection === 'progress' ? 'active' : ''} onClick={() => handleSectionClick('progress')}><FaTrophy /> Achievements & Progress</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default DashboardSidebar;
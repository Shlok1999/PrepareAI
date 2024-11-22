import React, { useEffect, useState } from 'react';
import '../../Style/DashboardSidebar.css'; // Sidebar-specific styling
import { account } from '../../appwrite/appwriteConfig';
function DashboardSidebar({ selectedSection, onSectionChange }) {
  const [userName, setUserName] = useState('');
  const [isOpen, setIsOpen] = useState(true); // Sidebar is open by default

  // Fetch username on mount
  useEffect(() => {
    const getUsername = async () => {
      try {
        const response = await account.get();
        setUserName(response.name.split(' ')[0]);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getUsername();
  }, []);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Handle section click
  const handleSectionClick = (section) => {
    onSectionChange(section); // Notify parent component
    localStorage.setItem('selectedSection', section); // Persist the section in localStorage
  };

  return (
    <div className={`dashboard-sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <button className="menu-button" onClick={toggleSidebar}>
        {isOpen ? '←' : '☰'} {/* Back button when open, hamburger menu when collapsed */}
      </button>

      {isOpen && (
        <div className="sidebar-content">
          <ul>
            <li>
              <strong>{userName}</strong>
            </li>
            <li
              className={selectedSection === 'syllabus' ? 'active' : ''}
              onClick={() => handleSectionClick('syllabus')}
            >
              Syllabus
            </li>
            <li
              className={selectedSection === 'test' ? 'active' : ''}
              onClick={() => handleSectionClick('test')}
            >
              Go To Test
            </li>
            <li
              className={selectedSection === 'profileSettings' ? 'active' : ''}
              onClick={() => handleSectionClick('profileSettings')}
            >
              Profile & Settings
            </li>
            <li
              className={selectedSection === 'resources' ? 'active' : ''}
              onClick={() => handleSectionClick('resources')}
            >
              Study Resources
            </li>
            <li
              className={selectedSection === 'progress' ? 'active' : ''}
              onClick={() => handleSectionClick('progress')}
            >
              Achievements & Progress
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default DashboardSidebar;

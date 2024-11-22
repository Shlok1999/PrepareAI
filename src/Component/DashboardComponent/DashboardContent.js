import React, { useEffect, useState } from 'react';
import '../../Style/DashboardContent.css';
import DashboardSidebar from './DashboardSidebar';
import Syllabus from './Syllabus';
import ProfileSettings from './ProfileSettings';
import TestHistoryMain from '../TestPages/TestHistory/TestHistoryMain';
import SelectTopics from './TestHomePage/SelectTopics';
import TestButtonsPage from './TestHomePage/TestButtonsPage';

function DashboardContent() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [showTestButtons, setShowTestButtons] = useState(false);

  useEffect(() => {
    // Load selected section from localStorage
    const savedSection = localStorage.getItem('selectedSection');
    setSelectedSection(savedSection || 'syllabus');

    // Check if topics exist in localStorage and are valid
    const topicsData = localStorage.getItem('topics');
    if (topicsData) {
      try {
        const parsedData = JSON.parse(topicsData);
        if (parsedData && parsedData.data && Object.keys(parsedData.data).length > 0) {
          setShowTestButtons(true);
        }
      } catch (error) {
        console.error('Error parsing topics from localStorage:', error);
        setShowTestButtons(false);
      }
    }
  }, []);

  const handleSaveTopics = () => {
    const topicsData = localStorage.getItem('topics');
    if (topicsData) {
      try {
        const parsedData = JSON.parse(topicsData);
        if (parsedData && parsedData.data && Object.keys(parsedData.data).length > 0) {
          setShowTestButtons(true);
        }
      } catch (error) {
        console.error('Error parsing topics from localStorage:', error);
        setShowTestButtons(false);
      }
    }
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    localStorage.setItem('selectedSection', section);
  };

  if (selectedSection === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <DashboardSidebar
        selectedSection={selectedSection}
        onSectionChange={handleSectionChange}
      />
      <div className="dashboard-content">
        {selectedSection === 'syllabus' && <Syllabus />}
        {selectedSection === 'test' && (
          showTestButtons ? <TestButtonsPage /> : <SelectTopics onSaveTopics={handleSaveTopics} />
        )}
        {selectedSection === 'profileSettings' && <ProfileSettings />}
        {selectedSection === 'resources' && <p>Resources will be available very soon...</p>}
        {selectedSection === 'progress' && <TestHistoryMain />}
      </div>
    </div>
  );
}

export default DashboardContent;

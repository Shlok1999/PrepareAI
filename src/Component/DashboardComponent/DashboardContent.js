import React, { useEffect, useState } from 'react';
import '../../Style/DashboardContent.css'; // Add CSS for styling content
import Syllabus from './Syllabus';
import ProfileSettings from './ProfileSettings';
import TestHistoryMain from '../TestPages/TestHistory/TestHistoryMain';
import SelectTopics from './TestHomePage/SelectTopics';
import TestButtonsPage from './TestHomePage/TestButtonsPage';
function DashboardContent({ selectedSection }) {
  const [showTestButtons, setShowTestButtons] = useState(false);

const handleSaveTopics = ()=>{
  if(localStorage.getItem('topics')){
    setShowTestButtons(true)
  }
  console.log(showTestButtons)
}

useEffect(()=>{
  handleSaveTopics()
},[])

 
  return (
    <div className="dashboard-content">
      {selectedSection === 'syllabus' && <Syllabus />}
      {selectedSection === 'test' && (
        <div>
          {showTestButtons ? (
            <TestButtonsPage /> // Show Test Buttons if topics were already selected within 7 days
          ) : (
            <SelectTopics onSaveTopics={handleSaveTopics} /> // Show Topic Selection Page
          )}
        </div>
      )}
      {selectedSection === 'profileSettings' && (
        <div>
          <h2>Profile & Settings</h2>
          <ProfileSettings />
        </div>
      )}
      {selectedSection === 'resources' && (
        <div>
          <h2>Study Resources</h2>
          <p>Resources will be availiable very soon...</p>
        </div>
      )}
      {selectedSection === 'progress' && (
        <div>
          <h2>Achievements & Progress</h2>
          <p>View your milestones and progress over time.</p>
          <TestHistoryMain />
        </div>
      )}
    </div>
  );
}

export default DashboardContent;

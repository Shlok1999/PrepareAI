import React from 'react';
import '../../Style/DashboardContent.css'; // Add CSS for styling content
import Syllabus from './Syllabus';
import ProfileSettings from './ProfileSettings';
import TestHistoryMain from '../TestPages/TestHistory/TestHistoryMain';

function DashboardContent({ selectedSection }) {
  return (
    <div className="dashboard-content">
      {selectedSection === 'syllabus' && (
        <div>
          {/* <p>Here you can view the syllabus for your courses.</p> */}
          <Syllabus/>
        </div>
      )}
      {selectedSection === 'testPerformance' && (
        <div>
          <h2>Test Performance</h2>
          <p>Track your performance and see detailed reports with charts.</p>
        </div>
      )}
      {selectedSection === 'profileSettings' && (
        <div>
          <h2>Profile & Settings</h2>
          <ProfileSettings/>
        </div>
      )}
      {selectedSection === 'resources' && (
        <div>
          <h2>Study Resources</h2>
          <p>Access various study materials and resources.</p>
        </div>
      )}
      {selectedSection === 'progress' && (
        <div>
          <h2>Achievements & Progress</h2>
          <p>View your milestones and progress over time.</p>
          <TestHistoryMain/>
        </div>
      )}
    </div>
  );
}

export default DashboardContent;

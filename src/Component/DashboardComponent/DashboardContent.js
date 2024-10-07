import React from 'react';
import '../../Style/DashboardContent.css'; // Add CSS for styling content

function DashboardContent({ selectedSection }) {
  return (
    <div className="dashboard-content">
      {selectedSection === 'syllabus' && (
        <div>
          <h2>Syllabus</h2>
          <p>Here you can view the syllabus for your courses.</p>
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
          <p>Update your profile and configure your account settings here.</p>
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
        </div>
      )}
    </div>
  );
}

export default DashboardContent;

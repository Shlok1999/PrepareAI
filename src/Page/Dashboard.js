import React, { useState } from 'react';
import DashboardSidebar from '../Component/DashboardComponent/DashboardSidebar';
import DashboardContent from '../Component/DashboardComponent/DashboardContent';
import '../Style/Dashboard.css'; // Main dashboard CSS

function Dashboard() {
  const [selectedSection, setSelectedSection] = useState('syllabus'); // Default section

  // Handle section change from sidebar
  return (
    <div className="dashboard-container">
      <DashboardContent selectedSection={selectedSection} />
    </div>
  );
}

export default Dashboard;

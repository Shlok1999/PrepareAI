import React, { useState } from "react";
import DashboardSidebar from "../Component/DashboardComponent/DashboardSidebar";
import DashboardContent from "../Component/DashboardComponent/DashboardContent";
import "../Style/Dashboard.css"; // Main dashboard CSS

function Dashboard() {
  const [selectedSection, setSelectedSection] = useState("syllabus"); // Default section
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar toggle state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar
        selectedSection={selectedSection}
        onSectionChange={setSelectedSection}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <DashboardContent selectedSection={selectedSection} />
      </div>
    </div>
  );
}

export default Dashboard;

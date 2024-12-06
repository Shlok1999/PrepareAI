import React, { useEffect, useState } from "react";
import "../../Style/DashboardContent.css";
import Syllabus from "./Syllabus";
import ProfileSettings from "./ProfileSettings";
import TestHistoryMain from "../TestPages/TestHistory/TestHistoryMain";
import SelectTopics from "./TestHomePage/SelectTopics";
import TestButtonsPage from "./TestHomePage/TestButtonsPage";

function DashboardContent({ selectedSection }) {
  const [showTestButtons, setShowTestButtons] = useState(false);

  useEffect(() => {
    const topicsData = localStorage.getItem("topics");
    if (topicsData) {
      try {
        const parsedData = JSON.parse(topicsData);
        if (parsedData && parsedData.data && Object.keys(parsedData.data).length > 0) {
          setShowTestButtons(true);
        }
      } catch (error) {
        console.error("Error parsing topics from localStorage:", error);
        setShowTestButtons(false);
      }
    }
  }, []);

  const handleSaveTopics = () => {
    const topicsData = localStorage.getItem("topics");
    if (topicsData) {
      try {
        const parsedData = JSON.parse(topicsData);
        if (parsedData && parsedData.data && Object.keys(parsedData.data).length > 0) {
          setShowTestButtons(true);
        }
      } catch (error) {
        console.error("Error parsing topics from localStorage:", error);
        setShowTestButtons(false);
      }
    }
  };

  return (
    <div className="p-6">
      {selectedSection === "syllabus" && <Syllabus />}
      {selectedSection === "test" && (
        showTestButtons ? <TestButtonsPage /> : <SelectTopics onSaveTopics={handleSaveTopics} />
      )}
      {selectedSection === "profileSettings" && <ProfileSettings />}
      {selectedSection === "resources" && (
        <div className="text-center text-gray-600">
          <p>Resources will be available very soon...</p>
        </div>
      )}
      {selectedSection === "progress" && <TestHistoryMain />}
    </div>
  );
}

export default DashboardContent;

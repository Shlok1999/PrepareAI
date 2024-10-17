import React, { useState } from 'react';
import '../../Style/DashboardSidebar.css'; // Sidebar specific styling

function DashboardSidebar({ onSectionChange }) {
    const [isOpen, setIsOpen] = useState(true); // Sidebar is open by default

    // Toggle sidebar visibility
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`dashboard-sidebar ${isOpen ? 'open' : 'collapsed'}`}>
            <button className="menu-button" onClick={toggleSidebar}>
                {isOpen ? '←' : '☰'} {/* Back button when open, hamburger menu when collapsed */}
            </button>

            {/* Sidebar content */}
            {isOpen && (
                <div className="sidebar-content">
                    <ul>
                        <li onClick={() => onSectionChange('syllabus')}>Syllabus</li>
                        <li onClick={() => onSectionChange('testPerformance')}>Upcoming Test</li>
                        <li onClick={() => onSectionChange('profileSettings')}>Profile & Settings</li>
                        <li onClick={() => onSectionChange('resources')}>Study Resources</li>
                        <li onClick={() => onSectionChange('progress')}>Achievements & Progress</li>

                        {/* Add more sections as needed */}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default DashboardSidebar;

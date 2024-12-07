import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  BookCheck,
  Trophy,
  Settings,
  BarChart,
  GraduationCap,
  X,
  UserCircle
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: UserCircle, label: 'Profile', to: '/dashboard/profile' },
  { icon: BookCheck, label: "My Tests", to: "/dashboard/tests" },
  { icon: BarChart, label: "Performance", to: "/dashboard/performance" },
  { icon: Trophy, label: "Achievements", to: "/dashboard/achievements" },
  { icon: GraduationCap, label: "Study Plan", to: "/dashboard/study-plan" },
  { icon: Settings, label: "Settings", to: "/dashboard/settings" },
];

export default function DashboardSidebar({ isOpen, onClose }) {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Simulating a fetch for the logged-in user's Google profile
    const profile = JSON.parse(sessionStorage.getItem("profile")) || {
      name: "John Doe",
      email: "johndoe@gmail.com",
      picture: "https://via.placeholder.com/150", // Placeholder profile image
    };
    setUserProfile(profile);
  }, []);

  const DashboardSidebarClasses = `
    fixed top-0 left-0 h-screen w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-20
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside className={DashboardSidebarClasses}>
        <div className="p-6">
          {/* Google User Profile */}
          <div className="flex items-center border-b pb-4 mb-4">
            <img
              src={userProfile?.picture}
              alt={userProfile?.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{userProfile?.name}</p>
              <p className="text-xs text-gray-500">{userProfile?.email}</p>
            </div>
          </div>

          {/* DashboardSidebar Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">PrepareAI</span>
            </div>
            <button
              onClick={onClose}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}


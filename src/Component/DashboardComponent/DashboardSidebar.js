import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  BookCheck,
  Trophy,
  Settings,
  BarChart,
  GraduationCap,
  X,
  UserCircle,
  Power,
} from "lucide-react";
import { account } from "../../appwrite/appwriteConfig"; // Import Appwrite account configuration
import { GiTeacher } from "react-icons/gi";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: UserCircle, label: "Profile", to: "/dashboard/profile" },
  { icon: BookCheck, label: "Practice", to: "/dashboard/tests" },
  { icon: BarChart, label: "Performance", to: "/dashboard/performance" },
  { icon: GraduationCap, label: "Study Plan", to: "/dashboard/study-plan" },
  { icon: GiTeacher, label: "Guidance", to: "/dashboard/guidance" },
  // { icon: Settings, label: "Settings", to: "/dashboard/settings" },
];

export default function DashboardSidebar({ isOpen, onClose }) {
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await account.get(); // Fetch user session data
        setUserProfile({
          name: user.name,
          email: user.email,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/"); // Redirect to homepage if no session
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await account.deleteSession("current"); // Delete the current Appwrite session
      sessionStorage.clear(); // Clear local session storage
      navigate("/"); // Redirect to login page
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

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
          {/* User Profile */}
          {userProfile ? (
            <div className="flex items-center border-b pb-4 mb-4">
              <div className="w-12 h-12 bg-indigo-500 text-white flex items-center justify-center rounded-full text-lg font-bold uppercase">
                {userProfile.name.charAt(0)} {/* First letter of user's name */}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {userProfile.name}
                </p>
                <p className="text-xs text-gray-500">{userProfile.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center border-b pb-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 text-gray-400 flex items-center justify-center rounded-full text-lg font-bold">
                ?
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Loading...</p>
              </div>
            </div>
          )}

          {/* Sidebar Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                PrepareAI
              </span>
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

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-3 rounded-lg transition-colors w-full text-left text-gray-600 hover:bg-gray-50"
            >
              <Power className="h-5 w-5 mr-3 text-red-500" />
              <span className="font-medium text-red-500">Logout</span>
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
}

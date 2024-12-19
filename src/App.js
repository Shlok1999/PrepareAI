import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Homepage from "./Page/Homepage";
import Test from "./Page/Test";
import RegistrationPage from "./Page/RegistrationPage";
import { TestsPage } from "./Page/TestPage";
import { DashboardContent } from "./Component/DashboardComponent/DashboardContent";
import { DashboardHome } from "./Component/DashboardComponent/DashboardHome";
import ProfileSettings from "./Component/DashboardComponent/Profile/ProfileSettings";
import PerformancePage from "./Page/PerformancePage";
import QuizPage from "./Page/QuizPage";
import { account } from "./appwrite/appwriteConfig"; // Appwrite config for checking user session

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // Check if user session exists
        await account.get();
        setIsLoggedIn(true);
      } catch (error) {
        console.error("No active session:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserSession();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading indicator while checking user session
  }

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route exact path="/" element={<Homepage />} />
        <Route exact path="/register" element={<RegistrationPage />} />

        {/* Protected Routes */}
        <Route
          exact
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardContent />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route
            path="tests"
            element={
              <ProtectedRoute>
                <TestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="performance"
            element={
              <ProtectedRoute>
                <PerformancePage/>
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/quiz/:subject"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />

        {/* Optional Test Page */}
        <Route
          exact
          path="/test"
          element={
            <ProtectedRoute>
              <Test />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

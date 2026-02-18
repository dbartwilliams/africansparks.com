import { Routes, Route, Navigate } from "react-router-dom";
import SparksFeed from "./components/SparksFeed";
import UserProfile from "./components/UserProfile";
import Auth from "./auth/AuthForm";
import HomePage from "./pages/HomePage";
import EmailVerificationPage from "./auth/EmailVerificationPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import NotificationFeed from "./components/NotificationFeed";
import Privacy from "./pages/privacy";
import SparkPage from "./components/SparkPage";
import FeedTabs from "./layouts/FeedTabs";


function App() {
  const { isCheckingAuth, checkAuth, } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />

      {/* Protected Layout - HomePage with Outlet */}
      <Route
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      >
        <Route path="/privacy" element={<Privacy />} />
        <Route index element={<FeedTabs />} /> 
        {/* <Route index element={<SparksFeed />} />  */}
        <Route path="notification" element={<NotificationFeed />} />  {/* /Notification */}

         <Route path="profile/:id" element={<UserProfile />} /> 

        {/* 👇 Individual Spark */}
        <Route path="spark/:sparkId" element={<SparkPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}

export default App;
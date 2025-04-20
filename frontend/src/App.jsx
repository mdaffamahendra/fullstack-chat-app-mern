import React, { useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";
import AddFriend from "./pages/AddFriend";
import RequestPage from "./pages/RequestPage";
import { useRequestStore } from "./store/useRequestStore";
import { useChatStore } from "./store/useChatStore";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, socket } = useAuthStore();
  const { theme } = useThemeStore();

  const {
    fetchRequestsFromUser,
    fetchRequestsFromMe,
    subscribeToRequest,
    unsubscribeToRequest,
  } = useRequestStore();

  const { subscribeNotifications, unsubscribeToNotif, fetchNotifications, setNavigate } =
    useChatStore();

  const hasSubscribedRequest = useRef(false);

  const hasSubscribedNotif = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate])

  useEffect(() => {
    if (socket && !hasSubscribedNotif.current) {
      fetchNotifications();
      subscribeNotifications();
      hasSubscribedNotif.current = true;
    }

    return () => {
      unsubscribeToNotif();
      hasSubscribedNotif.current = false;
    };
  }, [socket, fetchNotifications, subscribeNotifications]);

  useEffect(() => {
    if (socket && !hasSubscribedRequest.current) {
      subscribeToRequest();
      hasSubscribedRequest.current = true;
    }

    return () => {
      unsubscribeToRequest();
      hasSubscribedRequest.current = false;
    };
  }, [socket, fetchRequestsFromUser, fetchRequestsFromMe, subscribeToRequest]);

  useEffect(() => {
    fetchRequestsFromUser();
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/friend/add"
          element={authUser ? <AddFriend /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/request"
          element={authUser ? <RequestPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/"
          element={authUser ? <Homepage /> : <Navigate to={"/login"} />}
        />

        <Route path="/settings" element={<SettingsPage />} />

        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import LandingPage from "./components/LandingPage/LandingPage";
import LogInPage from "./components/Authentication/LogInPage";
import SignUpPage from "./components/Authentication/SignUpPage";
import ConfirmEmailPage from "./components/Authentication/ConfirmEmailPage";
import Interface from "./components/arman/Interface";
import Feed from "./components/Feed/Feed";
import { Timer } from "./components/Timer";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import ComingSoon from "./components/common/ComingSoon";
import OnboardingPage from "./components/Onboarding/OnboardingPage";
import { useState, useEffect } from "react";
import supabase from "./supabase/supabaseClient";

function AppRoutes() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.title = "SkillSync.";
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const session = await supabase.auth.getSession();
      setUser(session?.data?.session?.user ?? null);
    };

    checkUser();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Timer Component={LogInPage} />} />
      <Route path="/signup" element={<Timer Component={SignUpPage} />} />
      <Route
        path="/"
        element={<Timer Component={user ? HomePage : LandingPage} />}
      />
      <Route path="/landingpage" element={<Timer Component={LandingPage} />} />
      <Route path="/welcome" element={<Timer Component={OnboardingPage} />} />
      <Route path="/home/*" element={<HomePage />} />
      <Route path="/home" element={<Navigate to="/home/dashboard" />} />
      <Route path="/confirm" element={<Timer Component={ConfirmEmailPage} />} />
      <Route path="/comingSoon" element={<Timer Component={ComingSoon} />} />
      <Route path="/interface" element={<Timer Component={Interface} />} />
      <Route path="/feed" element={<Timer Component={Feed} />} />
      <Route path="/profile" element={<Timer Component={ProfilePage} />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

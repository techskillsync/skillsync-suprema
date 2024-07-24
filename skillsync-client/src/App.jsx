import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import AuthenticatedWelcomePage from "./components/AuthenticatedWelcomePage";
import HomePage from "./components/HomePage/HomePage";
import LandingPage from "./components/LandingPage/LandingPage";
import LogInPage from "./components/Authentication/LogInPage";
import SignUpPage from "./components/Authentication/SignUpPage";
import ConfirmEmailPage from "./components/Authentication/ConfirmEmailPage";
import Interface from "./components/arman/Interface";
import Feed from "./components/Feed/Feed";
import { Timer } from "./components/Timer";
import supabase from "./supabase/supabaseClient";
import ProfilePage from "./components/ProfilePage/ProfilePage";

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

function AppRoutes() {
  // const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const user = await supabase.auth.getSession();
      setUser(user);
    };

    checkUser();
  }, []);

  // useEffect(() => {
  //   const checkUser = async () => {
  //     const user = await supabase.auth.getSession();
  //     if (user) {
  //       navigate('/home'); // Navigate to the home page if the user is logged in
  //     } else {
  //       navigate('/'); // Navigate to the login page if the user is not logged in
  //     }
  //   };

  //   checkUser();
  // }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Timer Component={LogInPage} />} />
      <Route path="/signup" element={<Timer Component={SignUpPage} />} />
      <Route path="/" element={<Timer Component={user ? HomePage : LandingPage} />} />
      <Route path="/landingpage" element={<Timer Component={LandingPage} />} />
      <Route
        path="/welcome"
        element={<Timer Component={AuthenticatedWelcomePage} />}
      />
      <Route path="/home" element={<Timer Component={HomePage} />} />
      <Route path="/confirm" element={<Timer Component={ConfirmEmailPage} />} />
      <Route path="/interface" element={<Timer Component={Interface} />} />
      <Route path="/feed" element={<Timer Component={Feed} />} />
      <Route path="/profile" element={<Timer Component={ProfilePage} />} />
    </Routes>
  );
}

export default App;

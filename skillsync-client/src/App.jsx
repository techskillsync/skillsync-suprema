import { useEffect, useState } from "react";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthenticatedWelcomePage from "./components/AuthenticatedWelcomePage";
import HomePage from "./components/HomePage/HomePage";
import LandingPage from "./components/LandingPage/LandingPage";

import LogInPage from "./components/Authentication/LogInPage";
import SignUpPage from "./components/Authentication/SignUpPage";
import ConfirmEmailPage from "./components/Authentication/ConfirmEmailPage"
import Interface from "./components/arman/Interface"
import Feed from "./components/Feed/Feed"
import { Timer } from "./components/Timer"


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Timer Component={LogInPage} />} />
          <Route path="/signup" element={<Timer Component={SignUpPage} />} />
          <Route path="/" element={<Timer Component={LandingPage} />} />
          <Route path="/welcome" element={<Timer Component={AuthenticatedWelcomePage} />} />
          <Route path="/home" element={<Timer Component={HomePage} />} />
          <Route path="/confirm" element={<Timer Component={ConfirmEmailPage} />} />
          <Route path="/interface" element={<Timer Component={Interface} />} />
          <Route path="/feed" element={<Timer Component={Feed} />} />
        </Routes>
      </Router>
      {/* <ul>
        {testStrings.map((testString) => (
          <li key={testString.Data}>{testString.Data}</li>
        ))}
      </ul> */}
    </>
  );
}

export default App;

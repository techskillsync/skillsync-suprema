import { useEffect, useState } from "react";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthenticatedWelcomePage from "./components/AuthenticatedWelcomePage";
import HomePage from "./components/HomePage";
import LandingPage from "./components/LandingPage/LandingPage";

import LogInPage from "./components/Authentication/LogInPage";
import SignUpPage from "./components/Authentication/SignUpPage";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/welcome" element={<AuthenticatedWelcomePage />} />
          <Route path="/home" element={<HomePage />} />
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

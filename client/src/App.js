// Filename - App.js

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthenticatedWelcomePage from "./components/AuthenticatedWelcomePage";
import AuthenticationPage from "./components/AuthenticationPage";
import HomePage from "./components/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthenticationPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/welcome" element={<AuthenticatedWelcomePage />} />
      </Routes>
    </Router>
  );
}

export default App;

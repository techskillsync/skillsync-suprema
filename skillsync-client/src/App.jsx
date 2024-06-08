import { useEffect, useState } from "react";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthenticatedWelcomePage from "./components/AuthenticatedWelcomePage";
import AuthenticationPage from "./components/AuthenticationPage";
import HomePage from "./components/HomePage";
import LandingPage from "./components/LandingPage/LandingPage";

import supabase from './backend/supabaseClient'


function App() {
  const [count, setCount] = useState(0);
  const [testStrings, setTestStrings] = useState([]);

  useEffect(() => {
    getTestStrings();
  }, []);

  async function getTestStrings() {
    try {
      const { data, error } = await supabase.from("test").select("Data");

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      console.log("Fetched data:", data);
      setTestStrings(data);
    } catch (error) {
      console.error("Error connecting to Supabase:", error);
    }
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthenticationPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/welcome" element={<AuthenticatedWelcomePage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Router>
      <ul>
        {testStrings.map((testString) => (
          <li key={testString.Data}>{testString.Data}</li>
        ))}
      </ul>
    </>
  );
}

export default App;

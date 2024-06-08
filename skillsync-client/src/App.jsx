import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthenticatedWelcomePage from './components/AuthenticatedWelcomePage'
import AuthenticationPage from './components/AuthenticationPage'
import HomePage from './components/HomePage'
import LandingPage from './components/LandingPage/LandingPage'

function App() {
  const [count, setCount] = useState(0)

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
    </>
  )
}

export default App

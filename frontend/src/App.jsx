import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Analyze from './pages/Analyze'
import Results from './pages/Results'
import Prep from './pages/Prep'
import Dsa from './pages/Dsa'

const API_BASE = 'https://placeiq-ogr7.onrender.com'

export default function App() {
  const [resumeData, setResumeData]   = useState(null)
  const [githubData, setGithubData]   = useState(null)
  const [matchResults, setMatchResults] = useState([])

  const isAnalyzed = resumeData && githubData && matchResults.length > 0

  return (
    <Router>
      <Navbar isAnalyzed={isAnalyzed} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/analyze"
          element={
            <Analyze
              apiBase={API_BASE}
              resumeData={resumeData}
              setResumeData={setResumeData}
              githubData={githubData}
              setGithubData={setGithubData}
              matchResults={matchResults}
              setMatchResults={setMatchResults}
            />
          }
        />
        <Route
          path="/results"
          element={
            isAnalyzed
              ? <Results resumeData={resumeData} githubData={githubData} matchResults={matchResults} apiBase={API_BASE} />
              : <Navigate to="/analyze" replace />
          }
        />
        <Route
          path="/prep"
          element={
            isAnalyzed
              ? <Prep resumeData={resumeData} githubData={githubData} matchResults={matchResults} apiBase={API_BASE} />
              : <Navigate to="/analyze" replace />
          }
        />
        <Route
          path="/dsa"
          element={
            isAnalyzed
              ? <Dsa apiBase={API_BASE} matchResults={matchResults} />
              : <Navigate to="/analyze" replace />
          }
        />
      </Routes>
    </Router>
  )
}
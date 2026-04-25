import { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2 } from 'lucide-react';
import FileUpload from './components/FileUpload';
import GithubInput from './components/GithubInput';
import Dashboard from './components/Dashboard';
import CompanyCards from './components/CompanyCards';
import ResumeTips from './components/ResumeTips';
import InsightCard from './components/InsightCard';
import MockInterview from './components/MockInterview';
import SkillRoadmap from './components/SkillRoadmap';
import DSATracker from './components/DSATracker';
import ProgressDashboard from './components/ProgressDashboard';

const API_BASE = 'https://placeiq-ogr7.onrender.com';

function App() {
  const [resumeData, setResumeData]     = useState(null);
  const [githubData, setGithubData]     = useState(null);
  const [matchResults, setMatchResults] = useState(null);
  const [loadingMatch, setLoadingMatch] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      if (resumeData && githubData) {
        setLoadingMatch(true);
        try {
          const payload = {
            skills:       resumeData.skills || [],
            cgpa:         resumeData.cgpa || 0,
            github_score: githubData.github_score || 0
          };
          const res = await axios.post(`${API_BASE}/match`, payload);
          setMatchResults(res.data);
        } catch (error) {
          console.error("Failed to fetch matches", error);
        } finally {
          setLoadingMatch(false);
        }
      }
    };
    fetchMatches();
  }, [resumeData, githubData]);

  return (
    <div className="app-container">

      {/* HEADER */}
      <header className="header">
        <div className="header-badge">AI-Powered · Live Analysis</div>
        <h1>Place<span>IQ</span></h1>
        <p>Know exactly where you stand before placement season begins.</p>
      </header>

      {/* STEP 1 & 2 — Resume + GitHub */}
      <div className="grid-2 section">
        <div>
          <div className="step-label">
            <div className="step-number">1</div>
            <span className="step-title">Upload your resume</span>
          </div>
          <FileUpload onParsed={setResumeData} apiBase={API_BASE} />
        </div>
        <div>
          <div className="step-label">
            <div className="step-number">2</div>
            <span className="step-title">Connect GitHub</span>
          </div>
          <GithubInput onAnalyzed={setGithubData} apiBase={API_BASE} />
        </div>
      </div>

      {/* STEP 3 — Profile Diagnostics */}
      {(resumeData || githubData) && (
        <div className="section animate-up">
          <div className="step-label">
            <div className="step-number">3</div>
            <span className="step-title">Profile diagnostics</span>
          </div>
          <Dashboard resumeData={resumeData} githubData={githubData} />
        </div>
      )}

      {/* STEP 4 — Company Matches */}
      {resumeData && githubData && (
        <div className="section animate-up">
          <div className="step-label">
            <div className="step-number">4</div>
            <span className="step-title">Matched opportunities</span>
          </div>
          <div className="card">
            <div className="section-title">
              <Building2 size={20} />
              Company Match Results
            </div>
            {loadingMatch ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1.5rem 0', color: 'var(--text-2)' }}>
                <div className="spinner" />
                Analyzing your profile against 40 companies...
              </div>
            ) : (
              <CompanyCards matches={matchResults || []} />
            )}
          </div>
        </div>
      )}

      {/* STEP 5 — Progress Dashboard (charts) */}
      {resumeData && githubData && matchResults && (
        <ProgressDashboard
          resumeData={resumeData}
          githubData={githubData}
          matchResults={matchResults}
        />
      )}

      {/* STEP 6 — AI Insights */}
      {resumeData && githubData && matchResults && (
        <InsightCard
          resumeData={resumeData}
          githubData={githubData}
          matchResults={matchResults}
          apiBase={API_BASE}
        />
      )}

      {/* STEP 7 — Mock Interview */}
      {resumeData && matchResults && (
        <MockInterview
          resumeData={resumeData}
          matchResults={matchResults}
          apiBase={API_BASE}
        />
      )}

      {/* STEP 8 — Skill Gap Roadmap */}
      {resumeData && matchResults && (
        <SkillRoadmap
          resumeData={resumeData}
          matchResults={matchResults}
          apiBase={API_BASE}
        />
      )}

      {/* STEP 9 — DSA Tracker */}
      <DSATracker apiBase={API_BASE} />

      {/* STEP 10 — AI Resume Tips */}
      {resumeData && (
        <div className="section animate-up">
          <div className="step-label">
            <div className="step-number">10</div>
            <span className="step-title">AI resume tips</span>
          </div>
          <ResumeTips resumeData={resumeData} apiBase={API_BASE} />
        </div>
      )}

    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2 } from 'lucide-react';
import Navbar from './components/Navbar';
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
    <>
      {/* STICKY NAVBAR */}
      <Navbar
        resumeData={resumeData}
        githubData={githubData}
        matchResults={matchResults}
      />

      <div className="app-container" style={{ paddingTop: '4.5rem' }}>

        {/* HEADER */}
        <header className="header">
          <div className="header-badge">AI-Powered · Live Analysis</div>
          <h1>Place<span>IQ</span></h1>
          <p>Know exactly where you stand before placement season begins.</p>
        </header>

        {/* ── SECTION 1 — Profile Input ─────────── */}
        <section id="section-input">
          <SectionLabel number="01" title="Build your profile" />
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
        </section>

        {/* ── SECTION 2 — Dashboard ─────────────── */}
        {(resumeData || githubData) && (
          <section id="section-dashboard">
            <Divider />
            <SectionLabel number="02" title="Profile diagnostics" />
            <div className="section animate-up">
              <Dashboard resumeData={resumeData} githubData={githubData} />
            </div>
            {resumeData && githubData && matchResults && (
              <div className="section animate-up">
                <ProgressDashboard
                  resumeData={resumeData}
                  githubData={githubData}
                  matchResults={matchResults}
                />
              </div>
            )}
          </section>
        )}

        {/* ── SECTION 3 — Companies ─────────────── */}
        {resumeData && githubData && (
          <section id="section-companies">
            <Divider />
            <SectionLabel number="03" title="Matched opportunities" />
            <div className="section animate-up">
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
          </section>
        )}

        {/* ── SECTION 4 — AI Tools ──────────────── */}
        {resumeData && githubData && matchResults && (
          <section id="section-ai">
            <Divider />
            <SectionLabel number="04" title="AI-powered prep" />

            <InsightCard
              resumeData={resumeData}
              githubData={githubData}
              matchResults={matchResults}
              apiBase={API_BASE}
            />

            <MockInterview
              resumeData={resumeData}
              matchResults={matchResults}
              apiBase={API_BASE}
            />

            <SkillRoadmap
              resumeData={resumeData}
              matchResults={matchResults}
              apiBase={API_BASE}
            />

            {resumeData && (
              <div className="section animate-up">
                <div className="step-label">
                  <div className="step-number">10</div>
                  <span className="step-title">AI resume tips</span>
                </div>
                <ResumeTips resumeData={resumeData} apiBase={API_BASE} />
              </div>
            )}
          </section>
        )}

        {/* ── SECTION 5 — DSA ───────────────────── */}
        <section id="section-dsa">
          <Divider />
          <SectionLabel number="05" title="DSA readiness" />
          <DSATracker apiBase={API_BASE} />
        </section>

      </div>
    </>
  );
}

/* ── Section Label ──────────────────────── */
function SectionLabel({ number, title }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '1.5rem',
      paddingTop: '0.5rem',
    }}>
      <span style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        color: 'var(--accent)',
        fontFamily: 'Syne, sans-serif',
        letterSpacing: '0.1em',
        background: 'rgba(34,197,94,0.08)',
        border: '1px solid rgba(34,197,94,0.2)',
        borderRadius: '999px',
        padding: '3px 10px',
      }}>
        {number}
      </span>
      <span style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: '1.1rem',
        fontWeight: 700,
        color: 'var(--text)',
        letterSpacing: '-0.01em',
      }}>
        {title}
      </span>
    </div>
  );
}

/* ── Section Divider ────────────────────── */
function Divider() {
  return (
    <div style={{
      height: '1px',
      background: 'linear-gradient(90deg, transparent, var(--border), transparent)',
      margin: '2.5rem 0',
    }} />
  );
}

export default App;
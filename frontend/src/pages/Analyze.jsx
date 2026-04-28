import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import GithubInput from '../components/GithubInput';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://placeiq-ogr7.onrender.com';

export default function Analyze({ resumeData, setResumeData, githubData, setGithubData }) {
  const navigate = useNavigate();
  const canContinue = resumeData && githubData;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* NAV */}
      <nav style={{ padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1160px', margin: '0 auto', borderBottom: '1px solid var(--border)' }}>
        <span
          onClick={() => navigate('/')}
          style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', cursor: 'pointer' }}
        >
          Place<span style={{ color: 'var(--accent)' }}>IQ</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-3)' }}>
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>1. Profile</span>
          <span>→</span>
          <span>2. Results</span>
          <span>→</span>
          <span>3. AI Prep</span>
          <span>→</span>
          <span>4. DSA</span>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
            Build your profile
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: '0.95rem' }}>
            Upload your resume and connect GitHub to get started
          </p>
        </div>

        {/* STEP 1 — Resume */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="step-label" style={{ marginBottom: '0.75rem' }}>
            <div className="step-number">1</div>
            <span className="step-title">Upload your resume</span>
            {resumeData && <span style={{ fontSize: '0.75rem', color: 'var(--accent)', marginLeft: 'auto' }}>✓ Parsed successfully</span>}
          </div>
          <FileUpload onParsed={setResumeData} apiBase={API_BASE} />
        </div>

        {/* STEP 2 — GitHub */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="step-label" style={{ marginBottom: '0.75rem' }}>
            <div className="step-number">2</div>
            <span className="step-title">Connect GitHub</span>
            {githubData && <span style={{ fontSize: '0.75rem', color: 'var(--accent)', marginLeft: 'auto' }}>✓ @{githubData.username}</span>}
          </div>
          <GithubInput onAnalyzed={setGithubData} apiBase={API_BASE} />
        </div>

        {/* CONTINUE BUTTON */}
        <button
          onClick={() => navigate('/results')}
          disabled={!canContinue}
          style={{
            width: '100%',
            background: canContinue ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' : 'var(--surface-2)',
            color: canContinue ? '#fff' : 'var(--text-3)',
            border: 'none',
            borderRadius: '12px',
            padding: '0.9rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: canContinue ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: 'Syne, sans-serif',
            boxShadow: canContinue ? '0 4px 24px rgba(34,197,94,0.25)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          {canContinue ? <>View My Results <ArrowRight size={18} /></> : 'Complete both steps to continue'}
        </button>

        {!canContinue && (
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '0.75rem' }}>
            {!resumeData && !githubData ? 'Upload resume and connect GitHub to continue' : !resumeData ? 'Upload your resume to continue' : 'Connect GitHub to continue'}
          </p>
        )}
      </div>
    </div>
  );
}
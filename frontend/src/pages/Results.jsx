import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, ArrowRight, ArrowLeft } from 'lucide-react';
import Dashboard from '../components/Dashboard';
import CompanyCards from '../components/CompanyCards';
import ProgressDashboard from '../components/ProgressDashboard';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://placeiq-ogr7.onrender.com';

export default function Results({ resumeData, githubData, matchResults, setMatchResults }) {
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!resumeData || !githubData) {
      navigate('/analyze');
      return;
    }
    if (!matchResults || matchResults.length === 0) {
  fetchMatches();
}
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const payload = {
        skills:       resumeData.skills || [],
        cgpa:         resumeData.cgpa || 0,
        github_score: githubData.github_score || 0
      };
      const res = await axios.post(`${API_BASE}/match`, payload);
      setMatchResults(res.data);
    } catch (err) {
      console.error('Match failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* NAV */}
      <nav style={{ padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1160px', margin: '0 auto', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'rgba(11,15,20,0.92)', backdropFilter: 'blur(16px)', zIndex: 99 }}>
        <span onClick={() => navigate('/')} style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', cursor: 'pointer' }}>
          Place<span style={{ color: 'var(--accent)' }}>IQ</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-3)' }}>
          <span onClick={() => navigate('/analyze')} style={{ cursor: 'pointer' }}>1. Profile</span>
          <span>→</span>
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>2. Results</span>
          <span>→</span>
          <span onClick={() => navigate('/prep')} style={{ cursor: 'pointer' }}>3. AI Prep</span>
          <span>→</span>
          <span onClick={() => navigate('/dsa')} style={{ cursor: 'pointer' }}>4. DSA</span>
        </div>
        <button onClick={() => navigate('/prep')} style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', color: '#fff', border: 'none', borderRadius: '999px', padding: '6px 16px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          AI Prep <ArrowRight size={13} />
        </button>
      </nav>

      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* PROFILE DIAGNOSTICS */}
        <section style={{ marginBottom: '2.5rem' }}>
          <SectionLabel number="01" title="Profile diagnostics" />
          <Dashboard resumeData={resumeData} githubData={githubData} />
        </section>

        {/* COMPANY MATCHES */}
        <section style={{ marginBottom: '2.5rem' }}>
          <SectionLabel number="02" title="Company matches" />
          <div className="card">
            <div className="section-title">
              <Building2 size={20} />
              Company Match Results
            </div>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1.5rem 0', color: 'var(--text-2)' }}>
                <div className="spinner" />
                Analyzing your profile against 40 companies...
              </div>
            ) : (
              <CompanyCards matches={matchResults || []} />
            )}
          </div>
        </section>

        {/* PROGRESS DASHBOARD */}
       {matchResults && matchResults.length > 0 && (
  <section style={{ marginBottom: '2.5rem' }}>
    <SectionLabel number="03" title="Progress overview" />
    <ProgressDashboard resumeData={resumeData} githubData={githubData} matchResults={matchResults} />
  </section>
)}

        {/* NEXT */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button onClick={() => navigate('/analyze')} style={{ flex: 1, background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.85rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'Syne, sans-serif' }}>
            <ArrowLeft size={16} /> Update Profile
          </button>
          <button onClick={() => navigate('/prep')} style={{ flex: 2, background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', color: '#fff', border: 'none', borderRadius: '12px', padding: '0.85rem', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'Syne, sans-serif', boxShadow: '0 4px 20px rgba(34,197,94,0.25)' }}>
            Go to AI Prep <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ number, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', fontFamily: 'Syne, sans-serif', letterSpacing: '0.1em', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '999px', padding: '3px 10px' }}>{number}</span>
      <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>{title}</span>
    </div>
  );
}
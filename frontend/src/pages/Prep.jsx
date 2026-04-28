import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import InsightCard from '../components/InsightCard';
import MockInterview from '../components/MockInterview';
import SkillRoadmap from '../components/SkillRoadmap';
import ResumeTips from '../components/ResumeTips';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://placeiq-ogr7.onrender.com';

export default function Prep({ resumeData, githubData, matchResults }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!resumeData || !githubData) {
      navigate('/analyze');
    }
  }, []);

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
          <span onClick={() => navigate('/results')} style={{ cursor: 'pointer' }}>2. Results</span>
          <span>→</span>
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>3. AI Prep</span>
          <span>→</span>
          <span onClick={() => navigate('/dsa')} style={{ cursor: 'pointer' }}>4. DSA</span>
        </div>
        <button onClick={() => navigate('/dsa')} style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', color: '#fff', border: 'none', borderRadius: '999px', padding: '6px 16px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          DSA Tracker <ArrowRight size={13} />
        </button>
      </nav>

      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* TABS for this page */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>
            AI-Powered Prep
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>
            Personalized strategy, mock interviews, and skill roadmaps based on your profile
          </p>
        </div>

        {/* AI INSIGHTS */}
        <section style={{ marginBottom: '2rem' }}>
          <SectionLabel number="01" title="Placement strategy" />
          <InsightCard resumeData={resumeData} githubData={githubData} matchResults={matchResults} apiBase={API_BASE} />
        </section>

        <Divider />

        {/* MOCK INTERVIEW */}
        <section style={{ marginBottom: '2rem' }}>
          <SectionLabel number="02" title="Mock interview" />
          <MockInterview resumeData={resumeData} matchResults={matchResults} apiBase={API_BASE} />
        </section>

        <Divider />

        {/* SKILL ROADMAP */}
        <section style={{ marginBottom: '2rem' }}>
          <SectionLabel number="03" title="Skill gap roadmap" />
          <SkillRoadmap resumeData={resumeData} matchResults={matchResults} apiBase={API_BASE} />
        </section>

        <Divider />

        {/* RESUME TIPS */}
        <section style={{ marginBottom: '2rem' }}>
          <SectionLabel number="04" title="Resume tips" />
          <ResumeTips resumeData={resumeData} apiBase={API_BASE} />
        </section>

        {/* NAVIGATION */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button onClick={() => navigate('/results')} style={{ flex: 1, background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.85rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'Syne, sans-serif' }}>
            <ArrowLeft size={16} /> Back to Results
          </button>
          <button onClick={() => navigate('/dsa')} style={{ flex: 2, background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', color: '#fff', border: 'none', borderRadius: '12px', padding: '0.85rem', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'Syne, sans-serif', boxShadow: '0 4px 20px rgba(34,197,94,0.25)' }}>
            DSA Tracker <ArrowRight size={16} />
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

function Divider() {
  return <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)', margin: '2rem 0' }} />;
}
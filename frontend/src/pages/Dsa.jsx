import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DSATracker from '../components/DSATracker';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://placeiq-ogr7.onrender.com';

export default function DSA() {
  const navigate = useNavigate();

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
          <span onClick={() => navigate('/prep')} style={{ cursor: 'pointer' }}>3. AI Prep</span>
          <span>→</span>
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>4. DSA</span>
        </div>
        <button onClick={() => navigate('/analyze')} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '999px', padding: '6px 16px', color: 'var(--text-2)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
          New Analysis
        </button>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 2rem' }}>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>
            DSA Readiness
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>
            Real data from LeetCode — no self-rating bias
          </p>
        </div>

        <DSATracker apiBase={API_BASE} />

        <button
          onClick={() => navigate('/prep')}
          style={{ marginTop: '1.5rem', width: '100%', background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.85rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'Syne, sans-serif' }}
        >
          <ArrowLeft size={16} /> Back to AI Prep
        </button>
      </div>
    </div>
  );
}
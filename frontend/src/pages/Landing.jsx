import { useNavigate } from 'react-router-dom';
import { Zap, Github, Building2, BrainCircuit, ArrowRight, Code2, Map, BarChart2 } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    { icon: <Zap size={18} />,          title: 'Resume Parser',       desc: 'Extracts skills, CGPA and email from your PDF instantly' },
    { icon: <Github size={18} />,        title: 'GitHub Analyzer',     desc: 'Calculates your GitHub power score from repos and languages' },
    { icon: <Building2 size={18} />,     title: '40 Companies',        desc: 'Matched against real company requirements and cutoffs' },
    { icon: <BrainCircuit size={18} />,  title: 'AI Insights',         desc: 'Personalized placement strategy via Groq LLaMA 3.3 70B' },
    { icon: <Code2 size={18} />,         title: 'Mock Interview',      desc: '15 company-specific questions using real interview patterns' },
    { icon: <Map size={18} />,           title: 'Skill Roadmap',       desc: 'For each gap: topics, resources, and companies unlocked' },
    { icon: <BarChart2 size={18} />,     title: 'DSA Tracker',         desc: 'LeetCode integration mapped against company requirements' },
    { icon: <Building2 size={18} />,     title: 'Company Deep Dive',   desc: 'Full details: package, rounds, locations, bond' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* MINIMAL NAV */}
      <nav style={{ padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1160px', margin: '0 auto' }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Place<span style={{ color: 'var(--accent)' }}>IQ</span>
        </span>
        <button
          onClick={() => navigate('/analyze')}
          style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '999px', padding: '6px 18px', color: 'var(--text-2)', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s' }}
        >
          Get Started
        </button>
      </nav>

      {/* HERO */}
      <div style={{ textAlign: 'center', padding: '5rem 2rem 4rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.22)', borderRadius: '999px', padding: '5px 16px', fontSize: '11.5px', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '2rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 2s infinite' }} />
          AI-Powered · Live Analysis
        </div>

        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '1.5rem', background: 'linear-gradient(160deg, #fff 10%, #6B7280 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Place<span style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>IQ</span>
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--text-2)', fontWeight: 300, maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Know exactly where you stand before placement season begins.
        </p>

        <button
          onClick={() => navigate('/analyze')}
          style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', color: '#fff', border: 'none', borderRadius: '12px', padding: '0.9rem 2.5rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'Syne, sans-serif', boxShadow: '0 4px 24px rgba(34,197,94,0.3)', transition: 'all 0.2s' }}
        >
          Analyze My Profile <ArrowRight size={18} />
        </button>

        {/* STATS */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '3.5rem' }}>
          {[['40+', 'Companies'], ['10', 'AI Features'], ['Free', 'Forever']].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>{val}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 2rem 4rem' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '2.5rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>
          How it works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          {[
            { num: '01', title: 'Upload your resume', desc: 'Drop your PDF — we extract skills, CGPA, and contact info automatically' },
            { num: '02', title: 'Connect GitHub', desc: 'Enter your username — we analyze repos, languages, and calculate your score' },
            { num: '03', title: 'Get your strategy', desc: 'See which companies shortlist you and exactly what to do to improve' },
          ].map(({ num, title, desc }) => (
            <div key={num} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '3rem', fontWeight: 800, color: 'rgba(34,197,94,0.1)', position: 'absolute', top: '1rem', right: '1.25rem', lineHeight: 1 }}>{num}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>{title}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES GRID */}
      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 2rem 6rem' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '2.5rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>
          Everything you need
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.85rem' }}>
          {features.map(({ icon, title, desc }) => (
            <div key={title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', transition: 'border-color 0.2s' }}>
              <div style={{ color: 'var(--accent)', marginBottom: '0.6rem' }}>{icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.35rem' }}>{title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-2)', lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '3rem 2rem 6rem' }}>
        <button
          onClick={() => navigate('/analyze')}
          style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)', color: '#fff', border: 'none', borderRadius: '12px', padding: '0.9rem 2.5rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'Syne, sans-serif', boxShadow: '0 4px 24px rgba(34,197,94,0.3)' }}
        >
          Get Started Free <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
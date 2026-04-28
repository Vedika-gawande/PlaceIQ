import { useState, useEffect } from 'react';
import { Zap, BarChart2, Building2, BrainCircuit, Code2, ChevronUp } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'section-input',     label: 'Profile',    icon: Zap        },
  { id: 'section-dashboard', label: 'Dashboard',  icon: BarChart2  },
  { id: 'section-companies', label: 'Companies',  icon: Building2  },
  { id: 'section-ai',        label: 'AI Tools',   icon: BrainCircuit },
  { id: 'section-dsa',       label: 'DSA',        icon: Code2      },
];

export default function Navbar({ resumeData, githubData, matchResults }) {
  const [active, setActive]       = useState('section-input');
  const [scrolled, setScrolled]   = useState(false);
  const [showTop, setShowTop]     = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      setShowTop(window.scrollY > 400);

      // highlight active section
      for (const item of [...NAV_ITEMS].reverse()) {
        const el = document.getElementById(item.id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(item.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // only show nav items that have data
  const visibleItems = NAV_ITEMS.filter(item => {
    if (item.id === 'section-input')     return true;
    if (item.id === 'section-dashboard') return resumeData || githubData;
    if (item.id === 'section-companies') return resumeData && githubData;
    if (item.id === 'section-ai')        return resumeData && githubData && matchResults;
    if (item.id === 'section-dsa')       return true;
    return true;
  });

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 999,
        background: scrolled ? 'rgba(11,15,20,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 2rem',
      }}>
        <div style={{
          maxWidth: '1160px',
          margin: '0 auto',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <span
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer', letterSpacing: '-0.02em' }}
          >
            Place<span style={{ color: 'var(--accent)' }}>IQ</span>
          </span>

          {/* Nav items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {visibleItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  border: active === id ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent',
                  background: active === id ? 'rgba(34,197,94,0.08)' : 'transparent',
                  color: active === id ? 'var(--accent)' : 'var(--text-2)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* Status dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-3)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: matchResults ? 'var(--accent)' : resumeData || githubData ? 'var(--warning)' : 'var(--text-3)' }} />
            {matchResults ? 'Analysis complete' : resumeData || githubData ? 'In progress...' : 'Upload to start'}
          </div>
        </div>
      </nav>

      {/* Scroll to top button */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 999,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--surface)',
            border: '1px solid var(--border-hover)',
            color: 'var(--text-2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            transition: 'all 0.2s',
          }}
        >
          <ChevronUp size={16} />
        </button>
      )}
    </>
  );
}
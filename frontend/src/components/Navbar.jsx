import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Zap, BarChart2, Building2, BrainCircuit, Code2, ChevronUp } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/analyze', label: 'Profile',   icon: Zap         },
  { path: '/results', label: 'Results',   icon: BarChart2   },
  { path: '/prep',    label: 'AI Tools',  icon: BrainCircuit },
  { path: '/dsa',     label: 'DSA',       icon: Code2       },
]

export default function Navbar({ isAnalyzed }) {
  const [scrolled, setScrolled] = useState(false)
  const [showTop, setShowTop]   = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      setShowTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // hide navbar on landing page
  if (location.pathname === '/') return null

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 999,
        background: scrolled ? 'rgba(11,15,20,0.92)' : 'rgba(11,15,20,0.7)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
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
            onClick={() => navigate('/')}
            style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer', letterSpacing: '-0.02em' }}
          >
            Place<span style={{ color: 'var(--accent)' }}>IQ</span>
          </span>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path
              const isLocked = path !== '/analyze' && !isAnalyzed

              return (
                <button
                  key={path}
                  onClick={() => !isLocked && navigate(path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    border: isActive ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent',
                    background: isActive ? 'rgba(34,197,94,0.08)' : 'transparent',
                    color: isLocked ? 'var(--text-3)' : isActive ? 'var(--accent)' : 'var(--text-2)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    opacity: isLocked ? 0.4 : 1,
                    transition: 'all 0.2s',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  <Icon size={13} />
                  {label}
                </button>
              )
            })}
          </div>

          {/* Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-3)' }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: isAnalyzed ? 'var(--accent)' : 'var(--text-3)'
            }} />
            {isAnalyzed ? 'Analysis complete' : 'Upload to start'}
          </div>
        </div>
      </nav>

      {/* Scroll to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 999,
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'var(--surface)', border: '1px solid var(--border-hover)',
            color: 'var(--text-2)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-md)', transition: 'all 0.2s',
          }}
        >
          <ChevronUp size={16} />
        </button>
      )}
    </>
  )
}
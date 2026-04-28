import { useState } from 'react';
import axios from 'axios';
import { Code2, AlertCircle, CheckCircle, Trophy, Flame, Target, ChevronDown, ChevronUp } from 'lucide-react';

export default function DSATracker({ apiBase }) {
  const [username, setUsername]   = useState('');
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [showAll, setShowAll]     = useState(false);

  const fetchLeetCode = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const res = await axios.post(`${apiBase}/analyze/leetcode`, { username });
      if (res.data.error) {
        setError(res.data.message || 'Could not fetch LeetCode data');
      } else {
        setData(res.data);
      }
    } catch (err) {
      setError('Failed to connect. Make sure Flask is running.');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (v) =>
    v >= 70 ? 'var(--success)' : v >= 40 ? 'var(--warning)' : 'var(--danger)';

  const levelColor = (level) => {
    if (level === 'Expert')       return 'var(--accent)';
    if (level === 'Advanced')     return 'var(--accent-2)';
    if (level === 'Intermediate') return 'var(--warning)';
    if (level === 'Developing')   return 'var(--accent-3)';
    return 'var(--danger)';
  };

  const companies = data
    ? (showAll ? data.company_readiness : data.company_readiness.slice(0, 8))
    : [];

  return (
      <div className="card">
        <div className="section-title">
          <Code2 size={20} />
          LeetCode DSA Analysis
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
          Enter your LeetCode username to get real DSA readiness — based on actual problems solved, not self-rating.
        </p>

        {/* INPUT */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', display: 'flex' }}>
              <Code2 size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchLeetCode()}
              placeholder="e.g. neal_wu"
            />
          </div>
          <button
            className="btn"
            style={{ width: 'auto', padding: '0 1.5rem' }}
            onClick={fetchLeetCode}
            disabled={loading || !username.trim()}
          >
            {loading
              ? <><div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Fetching...</>
              : <><Target size={15} /> Analyze</>
            }
          </button>
        </div>

        {error && (
          <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            <AlertCircle size={14} /> {error}
          </p>
        )}

        {/* RESULTS */}
        {data && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>

            {/* PROFILE HEADER */}
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'Syne, sans-serif' }}>
                    @{data.username}
                  </span>
                  {data.real_name && (
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>· {data.real_name}</span>
                  )}
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 10px', borderRadius: '999px', background: `${levelColor(data.level)}22`, border: `1px solid ${levelColor(data.level)}44`, color: levelColor(data.level) }}>
                    {data.level}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {data.ranking > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--text-3)' }}>
                      <Trophy size={12} style={{ color: 'var(--accent-3)' }} /> Rank #{data.ranking.toLocaleString()}
                    </span>
                  )}
                  {data.streak > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--text-3)' }}>
                      <Flame size={12} style={{ color: 'var(--danger)' }} /> {data.streak} day streak
                    </span>
                  )}
                  {data.active_days > 0 && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>
                      {data.active_days} active days
                    </span>
                  )}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: scoreColor(data.dsa_score), lineHeight: 1 }}>
                  {data.dsa_score}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  DSA Score
                </div>
              </div>
            </div>

            {/* SOLVED STATS */}
            <div className="stats-row">
              <div className="stat-box">
                <div className="stat-value">{data.solved.total}</div>
                <div className="stat-label">Total Solved</div>
              </div>
              <div className="stat-box">
                <div className="stat-value" style={{ color: 'var(--success)' }}>{data.solved.easy}</div>
                <div className="stat-label">Easy</div>
              </div>
              <div className="stat-box">
                <div className="stat-value" style={{ color: 'var(--warning)' }}>{data.solved.medium}</div>
                <div className="stat-label">Medium</div>
              </div>
              <div className="stat-box">
                <div className="stat-value" style={{ color: 'var(--danger)' }}>{data.solved.hard}</div>
                <div className="stat-label">Hard</div>
              </div>
            </div>

            {/* DIFFICULTY BARS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { label: 'Easy',   count: data.solved.easy,   total: 800,  color: 'var(--success)' },
                { label: 'Medium', count: data.solved.medium, total: 1700, color: 'var(--warning)' },
                { label: 'Hard',   count: data.solved.hard,   total: 700,  color: 'var(--danger)'  },
              ].map(({ label, count, total, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-2)', minWidth: '55px' }}>{label}</span>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: '999px', width: `${Math.min(100, (count / total) * 100)}%`, background: color, transition: 'width 0.7s ease' }} />
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color, minWidth: '50px', textAlign: 'right', fontFamily: 'Syne, sans-serif' }}>
                    {count} / {total}
                  </span>
                </div>
              ))}
            </div>

            {/* COMPANY READINESS */}
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.85rem' }}>
                Company DSA Readiness
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {companies.map((c, i) => (
                  <div key={i} className="subcard" style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: 500, flex: 1 }}>{c.company}</span>
                      {c.ready
                        ? <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--success)', fontWeight: 600 }}>
                            <CheckCircle size={12} /> DSA Ready
                          </span>
                        : <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
                            E:{c.required_easy} M:{c.required_medium} H:{c.required_hard} needed
                          </span>
                      }
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: scoreColor(c.readiness), fontFamily: 'Syne, sans-serif', minWidth: '36px', textAlign: 'right' }}>
                        {c.readiness}%
                      </span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '999px', height: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: '999px', width: `${c.readiness}%`, background: scoreColor(c.readiness), transition: 'width 0.6s ease' }} />
                    </div>
                    {c.focus_areas?.length > 0 && (
                      <div style={{ display: 'flex', gap: '5px', marginTop: '0.45rem', flexWrap: 'wrap' }}>
                        {c.focus_areas.map(f => (
                          <span key={f} className="pill pill-blue" style={{ fontSize: '0.65rem' }}>{f}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* SHOW MORE */}
              {data.company_readiness.length > 8 && (
                <button
                  onClick={() => setShowAll(p => !p)}
                  style={{ marginTop: '0.75rem', background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '6px 16px', color: 'var(--text-2)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.15s' }}
                >
                  {showAll
                    ? <><ChevronUp size={13} /> Show less</>
                    : <><ChevronDown size={13} /> Show all {data.company_readiness.length} companies</>
                  }
                </button>
              )}
            </div>

            {/* RETRY */}
            <button className="btn" onClick={fetchLeetCode} style={{ marginTop: '0.25rem' }}>
              <Code2 size={14} /> Refresh Data
            </button>
          </div>
        )}
   </div>
  );
}
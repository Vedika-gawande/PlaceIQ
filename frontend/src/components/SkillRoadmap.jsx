import { useState } from 'react';
import axios from 'axios';
import { Map, AlertCircle, ExternalLink, Clock, ChevronDown, ChevronUp, Unlock } from 'lucide-react';

export default function SkillRoadmap({ resumeData, matchResults, apiBase }) {
  const [roadmap, setRoadmap]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [expanded, setExpanded] = useState({});

  // collect all unique missing skills across companies
  const allMissing = matchResults
    ? [...new Set(matchResults.flatMap(m => m.missing_skills || []))]
    : [];

  // figure out which companies need each skill
  const skillToCompanies = {};
  if (matchResults) {
    matchResults.forEach(m => {
      (m.missing_skills || []).forEach(skill => {
        if (!skillToCompanies[skill]) skillToCompanies[skill] = [];
        skillToCompanies[skill].push(m.company);
      });
    });
  }

  // sort by how many companies need the skill
  const sortedMissing = allMissing
    .sort((a, b) => (skillToCompanies[b]?.length || 0) - (skillToCompanies[a]?.length || 0))
    .slice(0, 6);

  const fetchRoadmap = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        missing_skills:   sortedMissing,
        target_companies: ['Deutsche Bank', 'Razorpay', 'Zepto'],
        skills:           resumeData?.skills || []
      };
      const { data } = await axios.post(`${apiBase}/skill-roadmap`, payload);
      if (data.success) {
        setRoadmap(data.roadmap);
        const initial = {};
        data.roadmap.forEach((_, i) => { initial[i] = i === 0; });
        setExpanded(initial);
      } else {
        setError(data.message || 'Failed to generate roadmap');
      }
    } catch (err) {
      setError('Failed to connect. Make sure Flask is running.');
    } finally {
      setLoading(false);
    }
  };

  const toggle = (i) => setExpanded(p => ({ ...p, [i]: !p[i] }));

  const priorityStyle = (p) => {
    if (p === 'high')   return { color: 'var(--danger)',  bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.25)' };
    if (p === 'medium') return { color: 'var(--warning)', bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.25)'  };
    return                     { color: 'var(--success)', bg: 'rgba(34,197,94,0.1)',    border: 'rgba(34,197,94,0.25)'   };
  };

  if (!resumeData || !matchResults) return null;

  return (
    <div className="section animate-up">
      <div className="step-label">
        <div className="step-number">8</div>
        <span className="step-title">Skill Gap Roadmap</span>
      </div>

      <div className="card">
        <div className="section-title">
          <Map size={20} />
          Learning Roadmap
        </div>

        {/* missing skills preview */}
        <div style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: '0.6rem' }}>
            Top gaps blocking your shortlisting:
          </p>
          <div className="pill-row">
            {sortedMissing.map(skill => (
              <span key={skill} className="pill pill-red" style={{ fontSize: '0.75rem' }}>
                {skill}
                <span style={{ marginLeft: '4px', fontSize: '0.65rem', opacity: 0.7 }}>
                  ×{skillToCompanies[skill]?.length}
                </span>
              </span>
            ))}
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: '0.5rem' }}>
            Numbers show how many companies need each skill
          </p>
        </div>

        {!roadmap && !loading && (
          <button className="btn" onClick={fetchRoadmap}>
            <Map size={16} /> Generate Learning Roadmap
          </button>
        )}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-2)', padding: '1rem 0' }}>
            <div className="spinner" /> Building your personalized roadmap...
          </div>
        )}

        {error && (
          <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', fontSize: '0.85rem' }}>
            <AlertCircle size={14} /> {error}
          </p>
        )}

        {roadmap && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
            {roadmap.map((item, i) => {
              const ps = priorityStyle(item.priority);
              const isOpen = expanded[i];
              return (
                <div key={i} className="subcard" style={{ borderLeft: `3px solid ${ps.color}`, borderRadius: 'var(--radius)', padding: 0, overflow: 'hidden' }}>

                  {/* header — always visible */}
                  <div
                    onClick={() => toggle(i)}
                    style={{ padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                      <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', textTransform: 'capitalize' }}>
                        {item.skill}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: ps.bg, border: `1px solid ${ps.border}`, color: ps.color, flexShrink: 0 }}>
                        {item.priority}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-3)', flexShrink: 0 }}>
                        <Clock size={11} /> {item.time_to_learn}
                      </span>
                    </div>
                    {isOpen ? <ChevronUp size={15} style={{ color: 'var(--text-3)', flexShrink: 0 }} /> : <ChevronDown size={15} style={{ color: 'var(--text-3)', flexShrink: 0 }} />}
                  </div>

                  {/* expanded content */}
                  {isOpen && (
                    <div style={{ padding: '0 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border)' }}>

                      {/* why needed */}
                      <p style={{ fontSize: '0.83rem', color: 'var(--text-2)', lineHeight: 1.6, paddingTop: '0.85rem' }}>
                        {item.why_needed}
                      </p>

                      {/* topics */}
                      <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                          Topics to cover
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {item.topics?.map((topic, j) => (
                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: `${ps.color}22`, border: `1px solid ${ps.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: ps.color, flexShrink: 0 }}>
                                {j + 1}
                              </span>
                              <span style={{ fontSize: '0.83rem', color: 'var(--text)' }}>{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* resources */}
                      <div>
                        <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                          Resources
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {item.resources?.map((res, j) => (
                            <a
                              key={j}
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 500, padding: '4px 10px', borderRadius: '999px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#93C5FD', textDecoration: 'none', transition: 'background 0.15s' }}
                            >
                              {res.name}
                              <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '999px', background: res.type === 'free' ? 'rgba(34,197,94,0.15)' : 'rgba(251,191,36,0.15)', color: res.type === 'free' ? 'var(--success)' : 'var(--warning)' }}>
                                {res.type}
                              </span>
                              <ExternalLink size={10} />
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* companies unlocked */}
                      {item.companies_unlocked?.length > 0 && (
                        <div>
                          <p style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                            <Unlock size={11} /> Unlocks access to
                          </p>
                          <div className="pill-row" style={{ marginTop: 0 }}>
                            {item.companies_unlocked.map(c => (
                              <span key={c} className="pill pill-green" style={{ fontSize: '0.72rem' }}>{c}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <button className="btn" onClick={fetchRoadmap} style={{ marginTop: '0.25rem' }}>
              <Map size={14} /> Regenerate Roadmap
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

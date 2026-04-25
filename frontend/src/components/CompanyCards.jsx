import { useState, useMemo } from 'react';
import {
  CheckCircle, XCircle, TrendingUp, AlertTriangle,
  MapPin, DollarSign, ChevronDown, ChevronUp,
  Briefcase, Tag, X, Building2, Filter
} from 'lucide-react';

export default function CompanyCards({ matches }) {
  const [expanded, setExpanded]       = useState({});
  const [selected, setSelected]       = useState(null); // deep dive company
  const [domainFilter, setDomainFilter] = useState('all');
  const [typeFilter, setTypeFilter]   = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  if (!matches || matches.length === 0) {
    return (
      <div style={{ color: 'var(--text-3)', padding: '2rem 0', fontSize: '0.9rem' }}>
        No matching companies found. Try adding more skills to your resume.
      </div>
    );
  }

  // parse min package from "8-12 LPA" → 8
  const parseMinPackage = (pkg) => {
    if (!pkg || pkg === 'N/A') return 0;
    const match = pkg.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // filtered list
  const filtered = useMemo(() => {
    return matches.filter(m => {
      if (domainFilter  !== 'all' && m.domain !== domainFilter)  return false;
      if (typeFilter    !== 'all' && m.type   !== typeFilter)    return false;
      if (statusFilter  !== 'all') {
        if (statusFilter === 'shortlisted' && !m.will_shortlist)  return false;
        if (statusFilter === 'needs_work'  &&  m.will_shortlist)  return false;
      }
      if (packageFilter !== 'all') {
        const minPkg = parseMinPackage(m.avg_package);
        if (packageFilter === '20+'  && minPkg < 20)  return false;
        if (packageFilter === '10+'  && minPkg < 10)  return false;
        if (packageFilter === 'under10' && minPkg >= 10) return false;
      }
      return true;
    });
  }, [matches, domainFilter, typeFilter, packageFilter, statusFilter]);

  const toggle = (i) => setExpanded(p => ({ ...p, [i]: !p[i] }));

  const getBarClass     = (pct) => pct >= 70 ? 'high' : pct >= 45 ? 'mid' : 'low';
  const getPercentColor = (pct) => pct >= 70 ? 'var(--accent)' : pct >= 45 ? 'var(--warning)' : 'var(--danger)';

  const domainColor = (domain) => {
    if (domain === 'fintech')   return { bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)',  color: '#93C5FD' };
    if (domain === 'ecommerce') return { bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)',  color: 'var(--warning)' };
    if (domain === 'product')   return { bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)', color: '#C4B5FD' };
    if (domain === 'service')   return { bg: 'rgba(156,163,175,0.1)', border: 'rgba(156,163,175,0.25)', color: '#9CA3AF' };
    return { bg: 'rgba(110,231,183,0.1)', border: 'rgba(110,231,183,0.25)', color: 'var(--accent)' };
  };

  const FilterBtn = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      style={{
        padding: '4px 12px',
        borderRadius: '999px',
        border: `1px solid ${active ? 'rgba(34,197,94,0.4)' : 'var(--border)'}`,
        background: active ? 'rgba(34,197,94,0.1)' : 'var(--surface-2)',
        color: active ? 'var(--accent)' : 'var(--text-3)',
        fontSize: '0.75rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap'
      }}
    >
      {children}
    </button>
  );

  return (
    <div>
      {/* ── FILTERS ─────────────────────────────── */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '4px', minWidth: '60px' }}>
            <Filter size={11} /> Domain
          </span>
          {['all','fintech','ecommerce','product','service'].map(d => (
            <FilterBtn key={d} active={domainFilter === d} onClick={() => setDomainFilter(d)}>
              {d === 'all' ? 'All' : d}
            </FilterBtn>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-3)', minWidth: '60px' }}>Type</span>
          {[['all','All'],['MNC','MNC'],['startup','Startup']].map(([val, label]) => (
            <FilterBtn key={val} active={typeFilter === val} onClick={() => setTypeFilter(val)}>
              {label}
            </FilterBtn>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-3)', minWidth: '60px' }}>Package</span>
          {[['all','All'],['20+','20+ LPA'],['10+','10+ LPA'],['under10','Under 10']].map(([val, label]) => (
            <FilterBtn key={val} active={packageFilter === val} onClick={() => setPackageFilter(val)}>
              {label}
            </FilterBtn>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-3)', minWidth: '60px' }}>Status</span>
          {[['all','All'],['shortlisted','Shortlisted'],['needs_work','Needs Work']].map(([val, label]) => (
            <FilterBtn key={val} active={statusFilter === val} onClick={() => setStatusFilter(val)}>
              {label}
            </FilterBtn>
          ))}
        </div>

        <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: '2px' }}>
          Showing {filtered.length} of {matches.length} companies
        </div>
      </div>

      {/* ── COMPANY CARDS ───────────────────────── */}
      {filtered.length === 0 ? (
        <div style={{ color: 'var(--text-3)', padding: '1.5rem 0', fontSize: '0.85rem', textAlign: 'center' }}>
          No companies match the selected filters.
        </div>
      ) : (
        filtered.map((match, i) => {
          const isOpen = expanded[i];
          const dc     = domainColor(match.domain);
          return (
            <div
              key={i}
              className={`match-card ${match.will_shortlist ? 'shortlisted' : ''}`}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              {/* HEADER */}
              <div className="match-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    className="match-company"
                    onClick={() => setSelected(match)}
                    style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.15)', textUnderlineOffset: '3px' }}
                  >
                    {match.company}
                  </span>
                  {match.will_shortlist
                    ? <span className="match-badge badge-green"><CheckCircle size={11} /> Shortlisted</span>
                    : <span className="match-badge badge-red"><XCircle size={11} /> Needs work</span>
                  }
                  {match.domain && (
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: dc.bg, border: `1px solid ${dc.border}`, color: dc.color }}>
                      {match.domain}
                    </span>
                  )}
                  {match.type && (
                    <span style={{ fontSize: '0.68rem', fontWeight: 500, padding: '2px 8px', borderRadius: '999px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-3)' }}>
                      {match.type}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="match-percent" style={{ color: getPercentColor(match.match_percent) }}>
                    {match.match_percent}%
                  </span>
                  <button onClick={() => toggle(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', padding: '2px' }}>
                    {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="progress-wrap">
                <div className={`progress-bar ${getBarClass(match.match_percent)}`} style={{ width: `${match.match_percent}%` }} />
              </div>

              {/* QUICK INFO */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                {match.avg_package && match.avg_package !== 'N/A' && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-3)' }}>
                    <DollarSign size={11} style={{ color: 'var(--accent)' }} />{match.avg_package}
                  </span>
                )}
                {match.locations?.length > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-3)' }}>
                    <MapPin size={11} style={{ color: 'var(--accent-2)' }} />{match.locations.join(', ')}
                  </span>
                )}
                {match.bond && match.bond !== 'none' && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--warning)' }}>
                    <Briefcase size={11} /> Bond: {match.bond}
                  </span>
                )}
                {match.min_cgpa && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-3)' }}>
                    <Tag size={11} /> Min CGPA: {match.min_cgpa}
                  </span>
                )}
              </div>

              {/* SKILLS */}
              <div className="match-skills-row" style={{ marginTop: '0.85rem' }}>
                <div>
                  <div className="skills-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={11} style={{ color: 'var(--accent)' }} /> Matched
                  </div>
                  <div className="pill-row">
                    {match.matched_skills?.length > 0
                      ? match.matched_skills.map(s => <span key={s} className="pill pill-green">{s}</span>)
                      : <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>None</span>
                    }
                  </div>
                </div>
                <div>
                  <div className="skills-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={11} style={{ color: 'var(--danger)' }} /> Missing
                  </div>
                  <div className="pill-row">
                    {match.missing_skills?.length > 0
                      ? match.missing_skills.map(s => <span key={s} className="pill pill-red">{s}</span>)
                      : <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>Perfect match!</span>
                    }
                  </div>
                </div>
              </div>

              {/* EXPANDED */}
              {isOpen && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {match.bonus_skills?.length > 0 && (
                    <div>
                      <div className="skills-label" style={{ marginBottom: '0.4rem' }}>⚡ Good-to-have you have</div>
                      <div className="pill-row" style={{ marginTop: 0 }}>
                        {match.bonus_skills.map(s => <span key={s} className="pill pill-amber">{s}</span>)}
                      </div>
                    </div>
                  )}
                  {match.hiring_rounds?.length > 0 && (
                    <div>
                      <div className="skills-label" style={{ marginBottom: '0.6rem' }}>Interview process</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0', flexWrap: 'wrap' }}>
                        {match.hiring_rounds.map((round, ri) => (
                          <div key={ri} style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 500, padding: '3px 10px', borderRadius: '999px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)', whiteSpace: 'nowrap' }}>
                              {round}
                            </span>
                            {ri < match.hiring_rounds.length - 1 && (
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-3)', margin: '0 3px' }}>→</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setSelected(match)}
                    style={{ alignSelf: 'flex-start', background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '5px 14px', color: 'var(--text-2)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.15s' }}
                  >
                    <Building2 size={12} /> View full details
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}

      {/* ── DEEP DIVE MODAL ──────────────────────── */}
      {selected && (
        <DeepDive company={selected} onClose={() => setSelected(null)} domainColor={domainColor} getPercentColor={getPercentColor} getBarClass={getBarClass} />
      )}
    </div>
  );
}

/* ── Deep Dive Modal ─────────────────────── */
function DeepDive({ company, onClose, domainColor, getPercentColor, getBarClass }) {
  const dc = domainColor(company.domain);

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(4px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--surface)', border: '1px solid var(--border-hover)', borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: '580px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.6)', position: 'relative' }}
      >
        {/* close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-2)' }}
        >
          <X size={14} />
        </button>

        {/* HEADER */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 10px', borderRadius: '999px', background: dc.bg, border: `1px solid ${dc.border}`, color: dc.color }}>
              {company.domain}
            </span>
            <span style={{ fontSize: '0.7rem', fontWeight: 500, padding: '2px 10px', borderRadius: '999px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-3)' }}>
              {company.type}
            </span>
          </div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            {company.company}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {company.will_shortlist
              ? <span className="match-badge badge-green"><CheckCircle size={11} /> Likely shortlisted</span>
              : <span className="match-badge badge-red"><XCircle size={11} /> Needs more prep</span>
            }
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: getPercentColor(company.match_percent) }}>
              {company.match_percent}% match
            </span>
          </div>
        </div>

        {/* MATCH PROGRESS */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="progress-wrap">
            <div className={`progress-bar ${getBarClass(company.match_percent)}`} style={{ width: `${company.match_percent}%` }} />
          </div>
        </div>

        {/* INFO GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Package',   value: company.avg_package || 'N/A',          icon: '💰' },
            { label: 'Min CGPA',  value: company.min_cgpa || 'N/A',              icon: '🎓' },
            { label: 'Bond',      value: company.bond === 'none' ? 'No bond' : company.bond || 'N/A', icon: '📋' },
            { label: 'Locations', value: company.locations?.join(', ') || 'N/A', icon: '📍' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="subcard" style={{ padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                {icon} {label}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* INTERVIEW ROUNDS */}
        {company.hiring_rounds?.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
              Interview Process
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {company.hiring_rounds.map((round, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: 500, textTransform: 'capitalize' }}>{round}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS SECTION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* required */}
          <div>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
              Required Skills
            </p>
            <div className="pill-row" style={{ marginTop: 0 }}>
              {company.matched_skills?.map(s => <span key={s} className="pill pill-green">{s}</span>)}
              {company.missing_skills?.map(s => <span key={s} className="pill pill-red">{s}</span>)}
            </div>
          </div>

          {/* good to have */}
          {company.bonus_skills?.length > 0 && (
            <div>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                Good to Have (You Have These ⚡)
              </p>
              <div className="pill-row" style={{ marginTop: 0 }}>
                {company.bonus_skills.map(s => <span key={s} className="pill pill-amber">{s}</span>)}
              </div>
            </div>
          )}

          {/* missing */}
          {company.missing_skills?.length > 0 && (
            <div style={{ background: 'rgba(248,113,113,0.04)', border: '1px solid rgba(248,113,113,0.12)', borderRadius: 'var(--radius)', padding: '1rem' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                ⚠️ Skills to learn before applying
              </p>
              <div className="pill-row" style={{ marginTop: 0 }}>
                {company.missing_skills.map(s => <span key={s} className="pill pill-red">{s}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
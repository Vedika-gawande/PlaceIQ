import { useMemo } from 'react';
import { Activity } from 'lucide-react';

const ALL_SKILL_AREAS = [
  { area: 'Web Dev',   skills: ['javascript','react','node','html','css','php'] },
  { area: 'Backend',   skills: ['python','java','flask','django','spring boot'] },
  { area: 'Database',  skills: ['sql','mongodb','mysql','postgresql','redis'] },
  { area: 'DevOps',    skills: ['docker','kubernetes','aws','azure','linux','git'] },
  { area: 'ML/AI',     skills: ['machine learning','deep learning','tensorflow','pytorch'] },
  { area: 'Languages', skills: ['python','java','c++','javascript','typescript'] },
];

export default function ProgressDashboard({ resumeData, githubData, matchResults }) {
  if (!resumeData || !githubData || !matchResults) return null;

  const userSkills = new Set((resumeData.skills || []).map(s => s.toLowerCase()));

  const skillAreas = useMemo(() => ALL_SKILL_AREAS.map(area => {
    const matched = area.skills.filter(s => userSkills.has(s)).length;
    return {
      area: area.area,
      score: Math.round((matched / area.skills.length) * 100),
      matched,
      total: area.skills.length
    };
  }), [resumeData]);

  const topCompanies = useMemo(() =>
    matchResults.slice(0, 8),
  [matchResults]);

  const shortlistedCount = matchResults.filter(m => m.will_shortlist).length;
  const avgMatch         = Math.round(matchResults.reduce((s, m) => s + m.match_percent, 0) / matchResults.length);
  const topMatch         = Math.round(Math.max(...matchResults.map(m => m.match_percent)));
  const githubScore      = githubData.github_score || 0;

  const scoreColor = (v, high = 70, mid = 45) =>
    v >= high ? 'var(--success)' : v >= mid ? 'var(--warning)' : 'var(--danger)';

  const barColor = (pct) =>
    pct >= 60 ? 'var(--success)' : pct >= 45 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="section animate-up">
      <div className="step-label">
        <div className="step-number">5</div>
        <span className="step-title">Progress Dashboard</span>
      </div>

      <div className="card">
        <div className="section-title">
          <Activity size={20} />
          Placement Overview
        </div>

        {/* SUMMARY STATS */}
        <div className="stats-row" style={{ marginBottom: '1.75rem' }}>
          <div className="stat-box">
            <div className="stat-value" style={{ color: scoreColor(shortlistedCount, 10, 5) }}>
              {shortlistedCount}
            </div>
            <div className="stat-label">Shortlists</div>
          </div>
          <div className="stat-box">
            <div className="stat-value" style={{ color: scoreColor(avgMatch) }}>
              {avgMatch}%
            </div>
            <div className="stat-label">Avg Match</div>
          </div>
          <div className="stat-box">
            <div className="stat-value" style={{ color: scoreColor(topMatch) }}>
              {topMatch}%
            </div>
            <div className="stat-label">Best Match</div>
          </div>
          <div className="stat-box">
            <div className="stat-value" style={{ color: scoreColor(githubScore) }}>
              {githubScore}
            </div>
            <div className="stat-label">GitHub Score</div>
          </div>
        </div>

        {/* TWO COLUMN CHARTS */}
        <div className="grid-2" style={{ gap: '1.25rem' }}>

          {/* SKILL COVERAGE */}
          <div className="subcard">
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.1rem' }}>
              Skill Coverage
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {skillAreas.map((d) => (
                <div key={d.area}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>{d.area}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: scoreColor(d.score, 60, 30) }}>
                      {d.matched}/{d.total}
                    </span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '999px', height: '5px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '999px',
                      width: `${d.score}%`,
                      background: scoreColor(d.score, 60, 30),
                      transition: 'width 0.7s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TOP COMPANY MATCHES */}
          <div className="subcard">
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.1rem' }}>
              Top Company Matches
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {topCompanies.map((m) => (
                <div key={m.company} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-2)', minWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {m.company}
                  </span>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '999px', height: '5px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '999px',
                      width: `${m.match_percent}%`,
                      background: barColor(m.match_percent),
                      transition: 'width 0.7s ease'
                    }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: barColor(m.match_percent), minWidth: '36px', textAlign: 'right' }}>
                    {m.match_percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { BookOpen, Star, Mail, Code, GitCommit, Users, Target } from 'lucide-react';

export default function Dashboard({ resumeData, githubData }) {
  if (!resumeData && !githubData) return null;

  return (
    <div className="card">
      <div className="grid-2">
        {/* Resume */}
        <div className="subcard">
          <div className="subcard-title">
            <BookOpen size={14} /> Resume insights
          </div>

          {resumeData ? (
            <>
              {resumeData.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-2)', marginBottom: '1rem' }}>
                  <Mail size={13} /> {resumeData.email}
                </div>
              )}

              <div className="stats-row">
                <div className="stat-box">
                  <div className="stat-value" style={{ color: 'var(--accent)' }}>
                    {resumeData.cgpa ? resumeData.cgpa.toFixed(1) : 'N/A'}
                  </div>
                  <div className="stat-label">CGPA</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{resumeData.skills?.length || 0}</div>
                  <div className="stat-label">Skills</div>
                </div>
              </div>

              <div className="skills-label">Extracted skills</div>
              <div className="pill-row">
                {resumeData.skills?.length > 0 ? (
                  resumeData.skills.map(s => (
                    <span key={s} className="pill pill-blue">{s}</span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-3)' }}>No skills found</span>
                )}
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>Upload your resume to see insights.</p>
          )}
        </div>

        {/* GitHub */}
        <div className="subcard">
          <div className="subcard-title">
            <Star size={14} /> GitHub analytics
          </div>

          {githubData ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-2)', marginBottom: '1rem' }}>
                <Target size={13} />
                @{githubData.username}
                {githubData.name !== 'N/A' && (
                  <span style={{ color: 'var(--text-3)' }}>· {githubData.name}</span>
                )}
              </div>

              <div className="stats-row">
                <div className="stat-box">
                  <div className="stat-value" style={{ color: 'var(--accent)' }}>
                    {githubData.github_score}
                  </div>
                  <div className="stat-label">Power score</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{githubData.public_repos}</div>
                  <div className="stat-label">Repos</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">{githubData.followers}</div>
                  <div className="stat-label">Followers</div>
                </div>
              </div>

              <div className="skills-label">Top languages</div>
              <div className="pill-row">
                {githubData.top_languages?.length > 0 ? (
                  githubData.top_languages.map(lang => (
                    <span key={lang} className="pill pill-amber">
                      <Code size={10} style={{ display: 'inline', marginRight: '3px' }} />{lang}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-3)' }}>No repos found</span>
                )}
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>Connect GitHub to see analytics.</p>
          )}
        </div>
      </div>
    </div>
  );
}

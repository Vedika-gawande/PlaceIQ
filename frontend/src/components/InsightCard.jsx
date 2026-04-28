import { useState } from 'react';
import axios from 'axios';
import { Zap, Target, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function InsightCard({ resumeData, githubData, matchResults, apiBase }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInsights = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        skills: resumeData?.skills || [],
        cgpa: resumeData?.cgpa || 0,
        github_score: githubData?.github_score || 0,
        matches: matchResults || [],
        target_companies: ['Deutsche Bank', 'Razorpay', 'Zepto']
      };
      const { data } = await axios.post(`${apiBase}/insights`, payload);
      
      if (data.success) {
        setInsights(data.insights);
      } else {
        setError(data.message || 'Failed to generate insights');
      }
    } catch (err) {
      setError('Failed to fetch insights. Make sure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'var(--danger)';
    if (priority === 'medium') return 'var(--warning)';
    return 'var(--accent)';
  };

  const getConfidenceColor = (score) => {
    if (score >= 70) return 'var(--accent)';
    if (score >= 50) return 'var(--warning)';
    return 'var(--danger)';
  };

  if (!resumeData || !githubData || !matchResults) return null;

  return (
      <div className="card">
        <div className="section-title">
          <Zap size={20} />
          AI Placement Insights
        </div>

        {!insights && !loading && (
          <button className="btn" onClick={fetchInsights}>
            <Zap size={16} /> Generate Strategy
          </button>
        )}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-2)', padding: '1.5rem 0' }}>
            <div className="spinner" />
            Analyzing your placement potential...
          </div>
        )}

        {error && (
          <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', fontSize: '0.85rem', padding: '1rem 0' }}>
            <AlertCircle size={14} /> {error}
          </p>
        )}

        {insights && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingTop: '1rem' }}>
            
            {/* CONFIDENCE SCORE */}
            <div className="subcard" style={{ background: 'var(--surface-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Overall Readiness
                </span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: getConfidenceColor(insights.confidence_score) }}>
                  {insights.confidence_score}%
                </span>
              </div>
              <div className="progress-wrap">
                <div
                  className="progress-bar"
                  style={{ 
                    width: `${insights.confidence_score}%`,
                    background: insights.confidence_score >= 70 
                      ? 'linear-gradient(90deg, var(--accent-2), var(--accent))'
                      : insights.confidence_score >= 50
                      ? 'linear-gradient(90deg, var(--accent-3), #fbbf24)'
                      : 'linear-gradient(90deg, #ef4444, #f87171)'
                  }}
                />
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginTop: '0.75rem', lineHeight: 1.6 }}>
                {insights.overall_assessment}
              </p>
            </div>

            {/* TARGET COMPANIES */}
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Target size={16} style={{ color: 'var(--accent)' }} /> Your Targets
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="subcard">
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                    🟢 High Confidence
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {insights.realistic_targets?.high_confidence?.map(company => (
                      <span key={company} style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>
                        ✓ {company}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="subcard">
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--warning)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                    🟡 Medium Confidence
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {insights.realistic_targets?.medium_confidence?.map(company => (
                      <span key={company} style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>
                        → {company}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {insights.realistic_targets?.long_shot?.length > 0 && (
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--danger)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                    🔴 Long Shot (Stretch Goals)
                  </div>
                  <div className="pill-row">
                    {insights.realistic_targets.long_shot.map(company => (
                      <span key={company} className="pill pill-red">{company}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* STRENGTHS & GAPS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={14} style={{ color: 'var(--accent)' }} /> Strengths
                </h3>
                <div className="pill-row">
                  {insights.strength_areas?.map(strength => (
                    <span key={strength} className="pill pill-green">{strength}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={14} style={{ color: 'var(--danger)' }} /> Critical Gaps
                </h3>
                <div className="pill-row">
                  {insights.critical_gaps?.map(gap => (
                    <span key={gap} className="pill pill-red">{gap}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* ACTION PLAN */}
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={16} style={{ color: 'var(--accent)' }} /> Action Plan
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {insights.action_plan?.map((item, i) => (
                  <div key={i} className="subcard" style={{ borderLeft: `3px solid ${getPriorityColor(item.priority)}` }}>
                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                        {item.action}
                      </span>
                      <span className="pill" style={{ 
                        background: item.priority === 'high' ? 'rgba(248,113,113,0.1)' : item.priority === 'medium' ? 'rgba(251,191,36,0.1)' : 'rgba(110,231,183,0.1)',
                        borderColor: getPriorityColor(item.priority),
                        color: getPriorityColor(item.priority),
                        fontSize: '0.7rem'
                      }}>
                        {item.priority}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                      {item.impact}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-3)' }}>
                      <Clock size={12} /> {item.timeline} to complete
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* INTERVIEW FOCUS */}
            {insights.interview_focus_areas?.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>
                  📝 Interview Focus Areas
                </h3>
                <div className="pill-row">
                  {insights.interview_focus_areas.map(topic => (
                    <span key={topic} className="pill pill-blue">{topic}</span>
                  ))}
                </div>
              </div>
            )}

            <button className="btn" style={{ marginTop: '0.5rem' }} onClick={fetchInsights}>
              <Zap size={14} /> Regenerate Insights
            </button>
          </div>
        )}
    </div>
  );
}

import { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function ResumeTips({ resumeData, apiBase }) {
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTips = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`${apiBase}/analyze/resume-tips`, resumeData);
      setTips(data.tips);
    } catch (err) {
      setError('Failed to get tips. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const priorityColor = (p) => {
    if (p === 'high') return 'pill-red';
    if (p === 'medium') return 'pill-amber';
    return 'pill-blue';
  };

  if (!resumeData) return null;

  return (
    <div className="card">
      <div className="section-title">
        <Sparkles size={20} />
        AI Resume Tips
      </div>

      {!tips && !loading && (
        <button className="btn" onClick={fetchTips}>
          <Sparkles size={16} /> Generate Tips
        </button>
      )}

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-2)' }}>
          <div className="spinner" /> Analyzing your profile...
        </div>
      )}

      {error && (
        <p style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
          <AlertCircle size={14} /> {error}
        </p>
      )}

      {tips && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tips.map((tip, i) => (
            <div key={i} className="subcard">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{tip.tip}</span>
                <span className={`pill ${priorityColor(tip.priority)}`}>{tip.priority}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{tip.detail}</p>
            </div>
          ))}
          <button className="btn" style={{ marginTop: '4px' }} onClick={fetchTips}>
            <Sparkles size={14} /> Regenerate
          </button>
        </div>
      )}
    </div>
  );
}
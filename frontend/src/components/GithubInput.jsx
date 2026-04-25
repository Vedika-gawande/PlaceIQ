import { useState } from 'react';
import axios from 'axios';
import { GitBranch, Search, CheckCircle, AlertCircle } from 'lucide-react';

export default function GithubInput({ onAnalyzed, apiBase }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const { data } = await axios.post(`${apiBase}/analyze/github`, { username });
      if (data.error) {
      setError(data.message || 'GitHub API error. Check your token.');
      return;
    }
      onAnalyzed(data);
      setSuccess(true);
    } catch (err) {
      setError('Could not fetch GitHub profile. Check the username.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="form-group" style={{ marginBottom: '1rem', flex: 1 }}>
        <label>GitHub username</label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', display: 'flex' }}>
            <GitBranch size={16} />
          </span>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze(e)}
            placeholder="e.g. torvalds"
          />
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginTop: '0.5rem' }}>
          Enter just the username, not the full URL
        </p>
      </div>

      <button
        className="btn"
        onClick={handleAnalyze}
        disabled={loading || !username.trim()}
      >
        {loading ? (
          <><div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Analyzing...</>
        ) : success ? (
          <><CheckCircle size={16} /> Analyzed successfully</>
        ) : (
          <><Search size={16} /> Analyze profile</>
        )}
      </button>

      {error && (
        <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', marginTop: '0.75rem', fontSize: '0.85rem' }}>
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
}

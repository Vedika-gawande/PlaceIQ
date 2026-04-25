import { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle, AlertCircle, FileText, Loader2 } from 'lucide-react';

export default function FileUpload({ onParsed, apiBase }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setLoading(true);
    setError('');
    setProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 150);

    const formData = new FormData();
    formData.append('resume', selectedFile);
    
    try {
      const { data } = await axios.post(`${apiBase}/analyze/resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProgress(100);
      setTimeout(() => {
        onParsed(data);
        setLoading(false);
      }, 300);
    } catch (err) {
      clearInterval(progressInterval);
      setError('Failed to process resume. Make sure the backend is running.');
      console.error(err);
      setLoading(false);
      setProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="card scale-in">
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => !loading && document.getElementById('resume-upload').click()}
        style={{ cursor: loading ? 'default' : 'pointer' }}
      >
        <input
          id="resume-upload"
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={(e) => handleUpload(e.target.files[0])}
          disabled={loading}
        />

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', width: '60px', height: '60px' }}>
              <Loader2 
                size={60} 
                color="var(--accent)" 
                style={{ animation: 'spin 1s linear infinite' }}
              />
            </div>
            <div style={{ width: '100%', maxWidth: '300px' }}>
              <div className="progress-wrap" style={{ height: '4px', marginBottom: '8px' }}>
                <div 
                  className="progress-bar high" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', fontWeight: 500 }}>
                {progress < 30 ? 'Uploading...' : progress < 70 ? 'Parsing resume...' : progress < 100 ? 'Extracting skills...' : 'Complete!'}
              </p>
            </div>
          </div>
        ) : file ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }} className="fade-in">
            <CheckCircle size={48} color="var(--accent)" style={{ animation: 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '4px' }}>
                {file.name}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
                ✓ Parsed successfully
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '8px', opacity: 0.7 }}>
                Click or drag to replace
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <UploadCloud size={48} className="upload-icon" />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '4px' }}>
                Drop your PDF here
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>
                or click to browse · max 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            color: 'var(--danger)', 
            marginTop: '0.75rem', 
            fontSize: '0.85rem',
            animation: 'slideUp 0.3s ease'
          }}
        >
          <AlertCircle size={16} /> {error}
        </p>
      )}
    </div>
  );
}

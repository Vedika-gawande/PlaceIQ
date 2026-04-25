import React from 'react';

export function SkeletonCompanyCard() {
  return (
    <div className="skeleton-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-circle" style={{ width: '60px', height: '20px', borderRadius: '999px' }} />
      </div>
      <div className="skeleton skeleton-line long" style={{ height: '6px', marginBottom: '0.5rem' }} />
      <div className="skeleton skeleton-line medium" style={{ height: '12px', marginBottom: '1rem' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <div className="skeleton skeleton-line short" style={{ height: '10px', marginBottom: '0.5rem' }} />
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ width: '50px', height: '24px', borderRadius: '999px' }} />
            ))}
          </div>
        </div>
        <div>
          <div className="skeleton skeleton-line short" style={{ height: '10px', marginBottom: '0.5rem' }} />
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[1, 2].map(i => (
              <div key={i} className="skeleton" style={{ width: '50px', height: '24px', borderRadius: '999px' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonInsight() {
  return (
    <div className="card" style={{ animation: 'slideUp 0.6s ease forwards' }}>
      <div className="section-title">
        <div className="skeleton skeleton-circle" style={{ width: '20px', height: '20px' }} />
        <div className="skeleton skeleton-line short" style={{ height: '20px' }} />
      </div>
      
      <div className="subcard" style={{ marginBottom: '1.5rem' }}>
        <div className="skeleton skeleton-line medium" style={{ height: '16px', marginBottom: '1rem' }} />
        <div className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius)', marginBottom: '1rem' }} />
        <div className="skeleton skeleton-line long" style={{ height: '12px', marginBottom: '0.5rem' }} />
        <div className="skeleton skeleton-line medium" style={{ height: '12px' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="subcard">
            <div className="skeleton skeleton-line short" style={{ height: '12px', marginBottom: '0.5rem' }} />
            <div className="skeleton skeleton-line long" style={{ height: '14px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SpinnerOverlay({ message = "Loading..." }) {
  return (
    <div className="spinner-container">
      <div className="spinner spinner-lg" />
      <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', fontWeight: 500 }}>{message}</p>
    </div>
  );
}

export default { SkeletonCompanyCard, SkeletonInsight, SpinnerOverlay };

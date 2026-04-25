import { useState } from 'react';
import axios from 'axios';
import { BrainCircuit, ChevronDown, ChevronUp, AlertCircle, Code, BookOpen, Users, Building2, Calculator, Lightbulb, Info } from 'lucide-react';

export default function MockInterview({ resumeData, matchResults, apiBase }) {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [dropdownOpen, setDropdownOpen]       = useState(false);
  const [questions, setQuestions]             = useState(null);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState('');

  const companyList = matchResults
    ? matchResults.slice(0, 15).map(m => ({
        name:           m.company,
        missing_skills: m.missing_skills,
        match_percent:  m.match_percent
      }))
    : [];

  const handleGenerate = async () => {
    if (!selectedCompany) return;
    setLoading(true);
    setError('');
    setQuestions(null);
    const companyData = companyList.find(c => c.name === selectedCompany);
    try {
      const payload = {
        company:        selectedCompany,
        skills:         resumeData?.skills || [],
        missing_skills: companyData?.missing_skills || [],
        cgpa:           resumeData?.cgpa || 0,
        github_score:   0
      };
      const { data } = await axios.post(`${apiBase}/mock-interview`, payload);
      if (data.success) {
        setQuestions(data.data);
      } else {
        setError(data.message || 'Failed to generate questions');
      }
    } catch (err) {
      setError('Failed to connect. Make sure Flask is running.');
    } finally {
      setLoading(false);
    }
  };

  const difficultyStyle = (level) => {
    if (level === 'hard')   return { color: 'var(--danger)',  bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.25)' };
    if (level === 'medium') return { color: 'var(--warning)', bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.25)'  };
    return                         { color: 'var(--success)', bg: 'rgba(34,197,94,0.1)',    border: 'rgba(34,197,94,0.25)'   };
  };

  const totalQuestions = questions
    ? (questions.coding?.length || 0) +
      (questions.cs_fundamentals?.length || 0) +
      (questions.domain_specific?.length || 0) +
      (questions.behavioral?.length || 0) +
      (questions.aptitude?.length || 0)
    : 0;

  if (!resumeData || !matchResults) return null;

  return (
    <div className="section animate-up">
      <div className="step-label">
        <div className="step-number">7</div>
        <span className="step-title">Mock Interview Prep</span>
      </div>

      <div className="card">
        <div className="section-title">
          <BrainCircuit size={20} />
          Mock Interview Questions
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
          Questions are generated using real interview patterns from each company — not generic AI guesses.
        </p>

        {/* COMPANY SELECTOR */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>
            Select a company
          </label>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(p => !p)}
              style={{ width: '100%', background: 'var(--surface-2)', border: `1px solid ${dropdownOpen ? 'var(--border-focus)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '0.75rem 1rem', color: selectedCompany ? 'var(--text)' : 'var(--text-3)', fontSize: '0.95rem', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s', boxShadow: dropdownOpen ? '0 0 0 3px rgba(34,197,94,0.08)' : 'none' }}
            >
              <span>{selectedCompany || 'Choose a company...'}</span>
              <ChevronDown size={16} style={{ color: 'var(--text-3)', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
            </button>

            {dropdownOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'var(--surface-2)', border: '1px solid var(--border-hover)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', zIndex: 50, maxHeight: '260px', overflowY: 'auto' }}>
                {companyList.map((c) => (
                  <div
                    key={c.name}
                    onClick={() => { setSelectedCompany(c.name); setDropdownOpen(false); setQuestions(null); }}
                    style={{ padding: '0.65rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: selectedCompany === c.name ? 'rgba(34,197,94,0.08)' : 'transparent', borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-3)'}
                    onMouseLeave={e => e.currentTarget.style.background = selectedCompany === c.name ? 'rgba(34,197,94,0.08)' : 'transparent'}
                  >
                    <span style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500 }}>{c.name}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: c.match_percent >= 60 ? 'var(--success)' : c.match_percent >= 45 ? 'var(--warning)' : 'var(--danger)' }}>
                      {c.match_percent}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* GENERATE */}
        <button className="btn" onClick={handleGenerate} disabled={!selectedCompany || loading}>
          {loading
            ? <><div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Generating from real patterns...</>
            : <><BrainCircuit size={16} /> Generate 15 Interview Questions</>
          }
        </button>

        {error && (
          <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', marginTop: '0.75rem', fontSize: '0.85rem' }}>
            <AlertCircle size={14} /> {error}
          </p>
        )}

        {/* QUESTIONS OUTPUT */}
        {questions && (
          <div style={{ marginTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* HEADER */}
            <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 'var(--radius)', padding: '0.85rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BrainCircuit size={16} style={{ color: 'var(--accent)' }} />
                  {questions.company} — Interview Prep
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{totalQuestions} questions</span>
              </div>
              {questions.pattern_summary && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
                  {questions.pattern_summary}
                </p>
              )}
              {questions.rounds?.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {questions.rounds.map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '999px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-3)' }}>{r}</span>
                      {i < questions.rounds.length - 1 && <span style={{ fontSize: '0.6rem', color: 'var(--text-3)', margin: '0 2px' }}>→</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CODING */}
            {questions.coding?.length > 0 && (
              <QuestionSection
                icon={<Code size={15} style={{ color: 'var(--accent-2)' }} />}
                title="Coding / DSA"
                subtitle={`${questions.coding.length} questions`}
                accentColor="var(--accent-2)"
              >
                {questions.coding.map((q, i) => (
                  <CodingCard key={i} index={i+1} question={q} difficultyStyle={difficultyStyle} accentColor="var(--accent-2)" />
                ))}
              </QuestionSection>
            )}

            {/* CS FUNDAMENTALS */}
            {questions.cs_fundamentals?.length > 0 && (
              <QuestionSection
                icon={<BookOpen size={15} style={{ color: 'var(--accent-3)' }} />}
                title="CS Fundamentals"
                subtitle="OS · DBMS · CN · OOP"
                accentColor="var(--accent-3)"
              >
                {questions.cs_fundamentals.map((q, i) => (
                  <FundamentalsCard key={i} index={i+1} question={q} accentColor="var(--accent-3)" />
                ))}
              </QuestionSection>
            )}

            {/* DOMAIN SPECIFIC */}
            {questions.domain_specific?.length > 0 && (
              <QuestionSection
                icon={<Building2 size={15} style={{ color: '#C084FC' }} />}
                title="Domain Specific"
                subtitle={`${questions.company} industry knowledge`}
                accentColor="#C084FC"
              >
                {questions.domain_specific.map((q, i) => (
                  <DomainCard key={i} index={i+1} question={q} accentColor="#C084FC" />
                ))}
              </QuestionSection>
            )}

            {/* BEHAVIORAL */}
            {questions.behavioral?.length > 0 && (
              <QuestionSection
                icon={<Users size={15} style={{ color: 'var(--accent)' }} />}
                title="HR / Behavioral"
                subtitle="STAR method recommended"
                accentColor="var(--accent)"
              >
                {questions.behavioral.map((q, i) => (
                  <BehavioralCard key={i} index={i+1} question={q} accentColor="var(--accent)" />
                ))}
              </QuestionSection>
            )}

            {/* APTITUDE */}
            {questions.aptitude?.length > 0 && (
              <QuestionSection
                icon={<Calculator size={15} style={{ color: '#FB7185' }} />}
                title="Aptitude"
                subtitle="Logical & quantitative reasoning"
                accentColor="#FB7185"
              >
                {questions.aptitude.map((q, i) => (
                  <AptitudeCard key={i} index={i+1} question={q} accentColor="#FB7185" />
                ))}
              </QuestionSection>
            )}

            <button className="btn" onClick={handleGenerate}>
              <BrainCircuit size={14} /> Regenerate Questions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Section Wrapper ────────────────────── */
function QuestionSection({ icon, title, subtitle, accentColor, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.85rem' }}>
        {icon}
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'Syne, sans-serif' }}>{title}</span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-3)', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '999px', padding: '1px 8px' }}>{subtitle}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>{children}</div>
    </div>
  );
}

/* ── Coding Card ────────────────────────── */
function CodingCard({ index, question, difficultyStyle, accentColor }) {
  const [open, setOpen] = useState(false);
  const diff = question.difficulty ? difficultyStyle(question.difficulty) : null;
  return (
    <div className="subcard" onClick={() => setOpen(p => !p)} style={{ cursor: 'pointer', borderLeft: `3px solid ${accentColor}`, borderRadius: 'var(--radius)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <IndexBadge index={index} color={accentColor} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.6, fontWeight: 500 }}>{question.question}</p>
          {open && (
            <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {question.topic && <span className="pill pill-blue" style={{ fontSize: '0.7rem' }}>{question.topic}</span>}
                {diff && <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: diff.bg, border: `1px solid ${diff.border}`, color: diff.color }}>{question.difficulty}</span>}
              </div>
              {question.hint && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '8px', padding: '8px 10px' }}>
                  <Lightbulb size={13} style={{ color: 'var(--accent-3)', flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.5 }}>Hint: {question.hint}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <ChevronToggle open={open} />
      </div>
    </div>
  );
}

/* ── Fundamentals Card ──────────────────── */
function FundamentalsCard({ index, question, accentColor }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="subcard" onClick={() => setOpen(p => !p)} style={{ cursor: 'pointer', borderLeft: `3px solid ${accentColor}`, borderRadius: 'var(--radius)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <IndexBadge index={index} color={accentColor} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.6, fontWeight: 500 }}>{question.question}</p>
          {open && (
            <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {question.topic && <span className="pill pill-amber" style={{ fontSize: '0.7rem', alignSelf: 'flex-start' }}>{question.topic}</span>}
              {question.expected_answer_points?.length > 0 && (
                <div style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: '8px', padding: '8px 10px' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent-3)', marginBottom: '4px' }}>Key points to cover:</p>
                  {question.expected_answer_points.map((pt, i) => (
                    <p key={i} style={{ fontSize: '0.78rem', color: 'var(--text-2)', marginBottom: '2px' }}>• {pt}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <ChevronToggle open={open} />
      </div>
    </div>
  );
}

/* ── Domain Card ────────────────────────── */
function DomainCard({ index, question, accentColor }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="subcard" onClick={() => setOpen(p => !p)} style={{ cursor: 'pointer', borderLeft: `3px solid ${accentColor}`, borderRadius: 'var(--radius)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <IndexBadge index={index} color={accentColor} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.6, fontWeight: 500 }}>{question.question}</p>
          {open && (
            <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {question.topic && <span style={{ fontSize: '0.7rem', alignSelf: 'flex-start', padding: '2px 8px', borderRadius: '999px', background: 'rgba(192,132,252,0.1)', border: '1px solid rgba(192,132,252,0.25)', color: '#C084FC', fontWeight: 600 }}>{question.topic}</span>}
              {question.why_asked && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', background: 'rgba(192,132,252,0.05)', border: '1px solid rgba(192,132,252,0.12)', borderRadius: '8px', padding: '8px 10px' }}>
                  <Info size={13} style={{ color: '#C084FC', flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.5 }}>{question.why_asked}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <ChevronToggle open={open} />
      </div>
    </div>
  );
}

/* ── Behavioral Card ────────────────────── */
function BehavioralCard({ index, question, accentColor }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="subcard" onClick={() => setOpen(p => !p)} style={{ cursor: 'pointer', borderLeft: `3px solid ${accentColor}`, borderRadius: 'var(--radius)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <IndexBadge index={index} color={accentColor} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.6, fontWeight: 500 }}>{question.question}</p>
          {open && (
            <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.7rem', alignSelf: 'flex-start', padding: '2px 8px', borderRadius: '999px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: 'var(--success)', fontWeight: 600 }}>{question.framework}</span>
              {question.tip && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: '8px', padding: '8px 10px' }}>
                  <Lightbulb size={13} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.5 }}>{question.tip}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <ChevronToggle open={open} />
      </div>
    </div>
  );
}

/* ── Aptitude Card ──────────────────────── */
function AptitudeCard({ index, question, accentColor }) {
  const q = typeof question === 'string' ? question : question.question;
  return (
    <div className="subcard" style={{ borderLeft: `3px solid ${accentColor}`, borderRadius: 'var(--radius)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <IndexBadge index={index} color={accentColor} />
        <p style={{ fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.6, fontWeight: 500, flex: 1 }}>{q}</p>
      </div>
    </div>
  );
}

/* ── Shared Sub-components ──────────────── */
function IndexBadge({ index, color }) {
  return (
    <span style={{ minWidth: '22px', height: '22px', borderRadius: '50%', background: `${color}22`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color, flexShrink: 0, marginTop: '2px' }}>
      {index}
    </span>
  );
}

function ChevronToggle({ open }) {
  return open
    ? <ChevronUp size={14} style={{ color: 'var(--text-3)', flexShrink: 0, marginTop: '4px' }} />
    : <ChevronDown size={14} style={{ color: 'var(--text-3)', flexShrink: 0, marginTop: '4px' }} />;
}
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Jobs({ apiBase, resumeData }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState("india");
  const [typeFilter, setTypeFilter] = useState("all");
  const locationState = useLocation();
  const stateData = locationState.state;

  const detectJobType = (title, description) => {
    const text = (title + " " + description).toLowerCase();
    if (text.includes("intern")) return "internship";
    if (text.includes("part time") || text.includes("part-time")) return "part-time";
    if (text.includes("contract") || text.includes("freelance")) return "contract";
    return "full-time";
  };

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const skills = stateData?.skills || resumeData?.skills || ["Python", "React"];
      const company = stateData?.company || "";
      const res = await fetch(`${apiBase}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, location, company }),
      });
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      setError("Can't fetch job. Try again!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [location]);

  const filteredJobs = jobs.filter(job => {
    if (typeFilter === "all") return true;
    return detectJobType(job.title, job.description) === typeFilter;
  });

  const typeColors = {
    "full-time": { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)", color: "var(--accent)" },
    "part-time": { bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)", color: "#FCD34D" },
    "internship": { bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)", color: "#818CF8" },
    "contract": { bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.2)", color: "#FB923C" },
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "5rem 2rem 2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.5rem" }}>
        Job Listings
      </h1>
      {stateData?.company && (
        <p style={{ color: "var(--accent)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
          Showing jobs for: <strong>{stateData.company}</strong>
        </p>
      )}
      <p style={{ color: "var(--text-3)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
        Based on your matched skills � {filteredJobs.length} jobs found
      </p>

      {/* Location Filter */}
      <div style={{ marginBottom: "0.75rem" }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-3)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Location</p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["india", "bangalore", "mumbai", "hyderabad", "pune"].map((loc) => (
            <button
              key={loc}
              onClick={() => setLocation(loc)}
              style={{
                padding: "5px 14px",
                borderRadius: "999px",
                border: location === loc ? "1px solid rgba(34,197,94,0.4)" : "1px solid var(--border)",
                background: location === loc ? "rgba(34,197,94,0.1)" : "var(--surface-2)",
                color: location === loc ? "var(--accent)" : "var(--text-3)",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize"
              }}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Job Type Filter */}
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-3)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Job Type</p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["all", "full-time", "part-time", "internship", "contract"].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              style={{
                padding: "5px 14px",
                borderRadius: "999px",
                border: typeFilter === type ? "1px solid rgba(99,102,241,0.4)" : "1px solid var(--border)",
                background: typeFilter === type ? "rgba(99,102,241,0.1)" : "var(--surface-2)",
                color: typeFilter === type ? "#818CF8" : "var(--text-3)",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize"
              }}
            >
              {type === "all" ? "All Types" : type}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "1.25rem 1.5rem", opacity: 0.5 }}>
              <div style={{ height: "1rem", width: "60%", background: "var(--surface-2)", borderRadius: "4px", marginBottom: "0.5rem" }} />
              <div style={{ height: "0.75rem", width: "30%", background: "var(--surface-2)", borderRadius: "4px" }} />
            </div>
          ))}
        </div>
      )}
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {filteredJobs.map((job, i) => {
          const jobType = detectJobType(job.title, job.description);
          const tc = typeColors[jobType] || typeColors["full-time"];
          return (
            <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "1.25rem 1.5rem", transition: "border-color 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                    <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "1rem", fontWeight: 700, color: "var(--text)" }}>
                      {job.title}
                    </h2>
                    <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "2px 8px", borderRadius: "999px", background: tc.bg, border: "1px solid " + tc.border, color: tc.color, textTransform: "capitalize", whiteSpace: "nowrap" }}>
                      {jobType}
                    </span>
                  </div>
                  <p style={{ color: "var(--accent)", fontSize: "0.82rem", fontWeight: 600 }}>{job.company}</p>
                  <p style={{ color: "var(--text-3)", fontSize: "0.78rem", marginTop: "2px" }}>?? {job.location}</p>
                </div>
                {job.salary_min && job.salary_min > 0 && (
                  <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "999px", padding: "4px 12px", fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)", whiteSpace: "nowrap" }}>
                   ₹ {Math.round(job.salary_min / 100000)}L - ₹{Math.round(job.salary_max / 100000)}L
                  </div>
                )}
              </div>
              <p style={{ color: "var(--text-3)", fontSize: "0.8rem", marginTop: "0.75rem", lineHeight: 1.6 }}>
                {job.description}...
              </p>
              <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "1rem", padding: "6px 16px", background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)", color: "#fff", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none" }}>
                Apply Now ?
              </a>
            </div>
          );
        })}
      </div>

      {!loading && filteredJobs.length === 0 && (
        <p style={{ color: "var(--text-3)", marginTop: "2rem" }}>No jobs found. Try different filters!</p>
      )}
    </div>
  );
}

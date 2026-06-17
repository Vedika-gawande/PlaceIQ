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
      setError("Jobs fetch karta aala nahi. Try again!");
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

  const typeConfig = {
    "full-time":  { label: "Full Time",  bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.25)",  color: "#4ADE80" },
    "part-time":  { label: "Part Time",  bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.25)", color: "#FCD34D" },
    "internship": { label: "Internship", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.25)", color: "#818CF8" },
    "contract":   { label: "Contract",   bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.25)", color: "#FB923C" },
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const getCompanyColor = (name) => {
    const colors = ["#6366F1","#8B5CF6","#EC4899","#F59E0B","#10B981","#3B82F6","#EF4444","#14B8A6"];
    if (!name) return colors[0];
    return colors[name.charCodeAt(0) % colors.length];
  };

return (
<div className="page-enter" style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: "56px" }}>      {/* HEADER */}
<div style={{ borderBottom: "1px solid var(--border)", background: "rgba(11,15,20,0.95)", backdropFilter: "blur(16px)", position: "sticky", top: "56px", zIndex: 90, padding: "1.25rem 2rem" }}>        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ marginBottom: "1rem" }}>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginBottom: "2px" }}>
  Job Listings
</h1>
<p style={{ color: "var(--text-3)", fontSize: "0.8rem" }}>
  Based on your matched skills • {filteredJobs.length} opportunities found
</p>
          </div>

          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {/* Location */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-3)", fontWeight: 600 }}>Location:</span>
              {["india", "bangalore", "mumbai", "hyderabad", "pune"].map((loc) => (
                <button key={loc} onClick={() => setLocation(loc)} style={{
                  padding: "4px 12px", borderRadius: "6px",
                  border: location === loc ? "1px solid rgba(34,197,94,0.4)" : "1px solid var(--border)",
                  background: location === loc ? "rgba(34,197,94,0.1)" : "transparent",
                  color: location === loc ? "var(--accent)" : "var(--text-3)",
                  fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
                  transition: "all 0.15s"
                }}>
                  {loc}
                </button>
              ))}
            </div>

            {/* Job Type */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-3)", fontWeight: 600 }}>Type:</span>
              {["all", "full-time", "part-time", "internship", "contract"].map((type) => (
                <button key={type} onClick={() => setTypeFilter(type)} style={{
                  padding: "4px 12px", borderRadius: "6px",
                  border: typeFilter === type ? "1px solid rgba(99,102,241,0.4)" : "1px solid var(--border)",
                  background: typeFilter === type ? "rgba(99,102,241,0.1)" : "transparent",
                  color: typeFilter === type ? "#818CF8" : "var(--text-3)",
                  fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
                  transition: "all 0.15s"
                }}>
                  {type === "all" ? "All" : type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "1.5rem 2rem" }}>

        {/* SKELETON */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{ borderBottom: "1px solid var(--border)", padding: "1.25rem 0", display: "flex", gap: "1rem" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "var(--surface-2)", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: "0.9rem", width: "40%", background: "var(--surface-2)", borderRadius: "4px", marginBottom: "8px" }} />
                  <div style={{ height: "0.75rem", width: "25%", background: "var(--surface-2)", borderRadius: "4px", marginBottom: "8px" }} />
                  <div style={{ height: "0.7rem", width: "70%", background: "var(--surface-2)", borderRadius: "4px" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "10px", padding: "1rem", color: "var(--danger)", fontSize: "0.85rem" }}>
            {error}
          </div>
        )}

        {/* JOB LIST */}
        {!loading && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filteredJobs.map((job, i) => {
              const jobType = detectJobType(job.title, job.description);
              const tc = typeConfig[jobType] || typeConfig["full-time"];
              const initials = getInitials(job.company);
              const companyColor = getCompanyColor(job.company);

              return (
                <div
                  key={i}
                  style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1.25rem 0.5rem", borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Logo */}
                  <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: companyColor + "22", border: "1px solid " + companyColor + "44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, color: companyColor, flexShrink: 0, fontFamily: "Syne, sans-serif" }}>
                    {initials}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                      <div>
                        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "var(--text)", marginBottom: "3px", lineHeight: 1.3 }}>
                          {job.title}
                        </h2>
                        <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--accent)", marginBottom: "6px" }}>
                          {job.company}
                        </p>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-3)" }}>
                            {job.location}
                          </span>
                          <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: tc.bg, border: "1px solid " + tc.border, color: tc.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            {tc.label}
                          </span>
                          {job.salary_min && job.salary_min > 0 && (
                            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-2)" }}>
                              Rs.{Math.round(job.salary_min / 100000)}L - Rs.{Math.round(job.salary_max / 100000)}L
                            </span>
                          )}
                        </div>
                      </div><a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: "7px 18px", background: "transparent", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-2)", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,197,94,0.1)"; e.currentTarget.style.borderColor = "rgba(34,197,94,0.4)"; e.currentTarget.style.color = "var(--accent)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-2)"; }}
                      >
                        Apply
                      </a>
                    </div>
<p style={{ color: "var(--text-3)", fontSize: "0.78rem", marginTop: "8px", lineHeight: 1.6 }}>
                      {job.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredJobs.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-3)" }}>
            <p style={{ fontFamily: "Syne, sans-serif", fontSize: "1rem", fontWeight: 600, color: "var(--text-2)", marginBottom: "0.5rem" }}>No jobs found</p>
            <p style={{ fontSize: "0.82rem" }}>Try different location or job type filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
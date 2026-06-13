import { useState, useEffect } from "react";

export default function Jobs({ apiBase, resumeData }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState("india");

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const skills = resumeData?.skills || ["Python", "React", "Flask"];
      const res = await fetch(`${apiBase}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, location }),
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
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <h1 className="text-3xl font-bold text-indigo-400 mb-2">Job Listings</h1>
      <p className="text-gray-400 mb-6">Based on your skills from resume</p>

      {/* Location Filter */}
      <div className="flex gap-3 mb-8">
        {["india", "bangalore", "mumbai", "hyderabad", "pune"].map((loc) => (
          <button
            key={loc}
            onClick={() => setLocation(loc)}
            className={`px-4 py-1.5 rounded-full text-sm capitalize ${
              location === loc
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {loc}
          </button>
        ))}
        <button
          onClick={fetchJobs}
          className="px-4 py-1.5 rounded-full text-sm bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          Search
        </button>
      </div>

      {/* Jobs List */}
      {loading && <p className="text-gray-400">Loading jobs...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="grid gap-4">
        {jobs.map((job, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-indigo-500 transition">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-white">{job.title}</h2>
                <p className="text-indigo-400 text-sm">{job.company}</p>
                <p className="text-gray-500 text-sm mt-1">{job.location}</p>
              </div>
              {job.salary_min && (
                <div className="text-right text-sm text-gray-400">
                  ₹{Math.round(job.salary_min / 100000)}L - ₹{Math.round(job.salary_max / 100000)}L
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm mt-3">{job.description}...</p>
            
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg"
            >
              Apply Now →
            </a>
          </div>
        ))}
      </div>

      {!loading && jobs.length === 0 && (
        <p className="text-gray-500 mt-4">No jobs found. Try different location!</p>
      )}
    </div>
  );
}
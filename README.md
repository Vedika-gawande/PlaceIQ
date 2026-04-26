# PlaceIQ — AI-Powered Placement Readiness Tool

> Know exactly where you stand before placement season begins.

**Live Demo:** [place-iq.vercel.app](https://place-iq.vercel.app)

---

## What is PlaceIQ?

PlaceIQ is a full-stack AI tool that helps CS engineering students prepare for campus placements. Instead of applying blindly, students can analyze their profile against 40+ real companies and get a personalized placement strategy.

---

## Features

| Feature | Description |
|---------|-------------|
| 📄 Resume Parser | Extracts skills, CGPA, and email from PDF automatically |
| 🐙 GitHub Analyzer | Analyzes repos, languages, and calculates a GitHub power score |
| 🏢 Company Matcher | Matches your profile against 40 companies using a weighted scoring algorithm |
| 📊 Progress Dashboard | Visual skill coverage and company match charts |
| 🤖 AI Placement Insights | Groq LLaMA 3.3 70B generates personalized placement strategy |
| 🎯 Mock Interview | 15 company-specific questions across 5 categories using real interview patterns |
| 🗺️ Skill Gap Roadmap | For each missing skill: topics, free resources, timeline, companies unlocked |
| 💻 DSA Tracker | LeetCode integration — real solve counts mapped against company requirements |
| 🔍 Company Deep Dive | Full company details: package, hiring rounds, locations, bond, required skills |
| 🔧 Chrome Extension | One-click launch from browser toolbar with backend status indicator |

---

## Tech Stack

**Frontend**
- React 18 + Vite
- Axios for API calls
- Lucide React for icons
- Custom CSS with variables

**Backend**
- Python Flask
- Flask-CORS
- pdfplumber (PDF parsing)
- Gunicorn (production server)

**AI / APIs**
- Groq API — LLaMA 3.3 70B model
- GitHub REST API
- LeetCode GraphQL API

**Deployment**
- Frontend → Vercel
- Backend → Render
- Keep-alive → cron-job.org

---

## Matching Algorithm

```
Match Score = (Skill Match × 50%) + (CGPA Match × 30%) + (GitHub Score × 20%) + Bonus (up to 10%)

Shortlisted if score ≥ 60%
```

- **Skill Match** — required skills you have ÷ total required
- **CGPA Match** — full score if CGPA ≥ company cutoff, else proportional
- **GitHub Score** — based on repos, followers, language diversity
- **Bonus** — good-to-have skills beyond required (max 10% boost)

---

## Project Structure

```
PlaceIQ/
├── backend/
│   ├── app.py                  # Flask routes
│   ├── resume_parser.py        # PDF text extraction
│   ├── github_analyzer.py      # GitHub API integration
│   ├── matcher.py              # Company matching algorithm
│   ├── resume_tips.py          # AI resume tips via Groq
│   ├── ai_insights.py          # AI placement strategy via Groq
│   ├── mock_interview.py       # AI interview questions via Groq
│   ├── skill_roadmap.py        # AI skill roadmap via Groq
│   ├── leetcode_analyzer.py    # LeetCode GraphQL integration
│   └── data/
│       ├── companies.json      # 40 companies with enriched data
│       └── interview_data.json # Real interview patterns per company
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Main app component
│   │   ├── index.css           # Global styles
│   │   └── components/
│   │       ├── FileUpload.jsx
│   │       ├── GithubInput.jsx
│   │       ├── Dashboard.jsx
│   │       ├── CompanyCards.jsx
│   │       ├── ProgressDashboard.jsx
│   │       ├── InsightCard.jsx
│   │       ├── MockInterview.jsx
│   │       ├── SkillRoadmap.jsx
│   │       ├── DSATracker.jsx
│   │       └── ResumeTips.jsx
│   └── package.json
└── extension/
    ├── manifest.json
    ├── popup.html
    └── popup.js
```

---

## Running Locally

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate       # Windows
pip install -r requirements.txt

# Create .env file
echo GROQ_API_KEY=your_key > .env
echo GITHUB_TOKEN=your_token >> .env

python app.py
# Runs on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## Company Database

40 companies across 4 domains with 10 fields each:

- `required_skills` — core skills needed to get shortlisted
- `good_to_have` — bonus skills that improve match score
- `min_cgpa` — minimum CGPA cutoff
- `avg_package` — real salary range
- `hiring_rounds` — exact interview process
- `locations` — cities where company hires
- `bond` — service bond details
- `domain` — fintech / ecommerce / product / service
- `type` — MNC or startup
- `last_updated` — data freshness

---

## Chrome Extension

Install locally:
1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `extension/` folder

---

## Author

**Vedika Gawande**
2nd Year CSE — Govt. College of Engineering, Chhatrapati Sambhajinagar

- GitHub: [@Vedika-gawande](https://github.com/Vedika-gawande)
- Email: vedikagawande91@gmail.com

---


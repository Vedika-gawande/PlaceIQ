import os
import json
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

# load real interview data once
_DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "interview_data.json")
with open(_DATA_PATH) as f:
    INTERVIEW_DATA = json.load(f)

def get_mock_questions(data):
    """
    Generates 15 company-specific mock interview questions
    using real interview patterns as context for Groq.

    Input: {
        "company": "Deutsche Bank",
        "skills": ["python", "java", "sql"],
        "missing_skills": ["data structures", "algorithms"],
        "cgpa": 7.5,
        "github_score": 68
    }
    """
    client  = Groq(api_key=os.getenv("GROQ_API_KEY"))

    company        = data.get("company", "a tech company")
    skills         = data.get("skills", [])
    missing_skills = data.get("missing_skills", [])
    cgpa           = data.get("cgpa", 0)
    github_score   = data.get("github_score", 0)

    # get real company data if available
    company_info   = INTERVIEW_DATA.get(company, {})
    pattern        = company_info.get("pattern", "Standard technical interview")
    focus_areas    = company_info.get("focus_areas", [])
    real_questions = company_info.get("real_questions", [])
    domain_qs      = company_info.get("domain_questions", [])
    aptitude_qs    = company_info.get("aptitude", [])
    rounds         = company_info.get("rounds", [])

    has_aptitude   = len(aptitude_qs) > 0

    prompt = f"""You are a senior technical interviewer at {company}.

REAL INTERVIEW PATTERN AT {company.upper()}:
{pattern}

FOCUS AREAS: {', '.join(focus_areas) if focus_areas else 'general DSA and CS fundamentals'}

REAL QUESTIONS ACTUALLY ASKED AT {company.upper()} (use these as style reference):
{chr(10).join(['- ' + q for q in real_questions[:5]])}

DOMAIN-SPECIFIC QUESTIONS ASKED:
{chr(10).join(['- ' + q for q in domain_qs[:3]])}

STUDENT PROFILE:
- Known skills: {', '.join(skills) if skills else 'basic programming'}
- Weak areas: {', '.join(missing_skills) if missing_skills else 'none identified'}
- CGPA: {cgpa}
- GitHub Score: {github_score}/100

Generate exactly 15 interview questions for {company} following the REAL pattern above.
Target the student's weak areas specifically.
{"Include 2 aptitude questions since " + company + " tests aptitude." if has_aptitude else "No aptitude questions needed."}

Respond ONLY as a JSON object, no markdown, no extra text:
{{
  "company": "{company}",
  "pattern_summary": "one sentence describing {company}'s interview style",
  "rounds": {json.dumps(rounds)},
  "coding": [
    {{"question": "...", "difficulty": "easy/medium/hard", "topic": "specific topic", "hint": "brief hint or approach"}},
    {{"question": "...", "difficulty": "easy/medium/hard", "topic": "specific topic", "hint": "brief hint or approach"}},
    {{"question": "...", "difficulty": "easy/medium/hard", "topic": "specific topic", "hint": "brief hint or approach"}},
    {{"question": "...", "difficulty": "easy/medium/hard", "topic": "specific topic", "hint": "brief hint or approach"}},
    {{"question": "...", "difficulty": "easy/medium/hard", "topic": "specific topic", "hint": "brief hint or approach"}}
  ],
  "cs_fundamentals": [
    {{"question": "...", "topic": "OS/DBMS/CN/OOP", "expected_answer_points": ["point1", "point2"]}},
    {{"question": "...", "topic": "OS/DBMS/CN/OOP", "expected_answer_points": ["point1", "point2"]}},
    {{"question": "...", "topic": "OS/DBMS/CN/OOP", "expected_answer_points": ["point1", "point2"]}}
  ],
  "domain_specific": [
    {{"question": "...", "topic": "domain knowledge topic", "why_asked": "why this matters at {company}"}},
    {{"question": "...", "topic": "domain knowledge topic", "why_asked": "why this matters at {company}"}},
    {{"question": "...", "topic": "domain knowledge topic", "why_asked": "why this matters at {company}"}}
  ],
  "behavioral": [
    {{"question": "...", "framework": "STAR method recommended", "tip": "what {company} looks for"}},
    {{"question": "...", "framework": "STAR method recommended", "tip": "what {company} looks for"}}
  ],
  "aptitude": {json.dumps([{"question": q, "type": "aptitude"} for q in aptitude_qs[:2]]) if has_aptitude else "[]"}
}}"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2500,
            temperature=0.7
        )

        raw   = response.choices[0].message.content
        clean = raw.strip().replace("```json", "").replace("```", "").strip()
        questions = json.loads(clean)
        return {"success": True, "data": questions}

    except json.JSONDecodeError as e:
        return {"success": False, "error": "Failed to parse response", "message": str(e)}
    except Exception as e:
        return {"success": False, "error": "Failed to generate questions", "message": str(e)}
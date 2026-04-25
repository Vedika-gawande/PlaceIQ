import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

def get_ai_insights(student_profile):
    """
    Takes student profile (resume + github data + match results)
    Returns personalized placement insights using Groq
    """
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    # Build context from profile
    skills = student_profile.get('skills', [])
    cgpa = student_profile.get('cgpa', 0)
    github_score = student_profile.get('github_score', 0)
    matches = student_profile.get('matches', [])  # Top matching companies
    target_companies = student_profile.get('target_companies', ['Deutsche Bank', 'Razorpay', 'Zepto'])

    # Find shortlisted vs needs-work companies
    shortlisted = [m for m in matches if m['will_shortlist']]
    not_shortlisted = [m for m in matches if not m['will_shortlist']]

    prompt = f"""You are an expert placement counselor for a CS engineering student preparing for placements.

STUDENT PROFILE:
- Skills: {', '.join(skills) if skills else 'None identified'}
- CGPA: {cgpa}
- GitHub Power Score: {github_score}/100
- Target Companies: {', '.join(target_companies)}

MATCH ANALYSIS:
- Likely Shortlist ({len(shortlisted)}): {', '.join([m['company'] for m in shortlisted[:5]]) if shortlisted else 'None'}
- Needs Work ({len(not_shortlisted)}): {', '.join([m['company'] for m in not_shortlisted[:5]])}

MISSING SKILLS (most common across target companies):
"""
    # Add missing skills from not_shortlisted companies
    all_missing = []
    for match in not_shortlisted[:10]:
        all_missing.extend(match.get('missing_skills', []))
    
    missing_skills_count = {}
    for skill in all_missing:
        missing_skills_count[skill] = missing_skills_count.get(skill, 0) + 1
    
    top_missing = sorted(missing_skills_count.items(), key=lambda x: x[1], reverse=True)[:5]
    prompt += ", ".join([f"{skill} (needed by {count} companies)" for skill, count in top_missing])

    prompt += f"""

Generate a JSON response with the following structure (ONLY JSON, no markdown, no extra text):
{{
  "overall_assessment": "2-3 sentence summary of their placement readiness",
  "realistic_targets": {{
    "high_confidence": ["company1", "company2"],
    "medium_confidence": ["company3", "company4"],
    "long_shot": ["company5"]
  }},
  "strength_areas": ["skill1", "skill2"],
  "critical_gaps": ["gap1", "gap2"],
  "action_plan": [
    {{"priority": "high", "action": "specific action", "timeline": "weeks", "impact": "why this matters"}},
    {{"priority": "medium", "action": "specific action", "timeline": "weeks", "impact": "why this matters"}},
    {{"priority": "low", "action": "specific action", "timeline": "weeks", "impact": "why this matters"}}
  ],
  "interview_focus_areas": ["topic1", "topic2", "topic3"],
  "confidence_score": 72
}}"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1500,
            temperature=0.7
        )

        raw = response.choices[0].message.content
        clean = raw.strip().replace("```json", "").replace("```", "").strip()
        insights = json.loads(clean)
        return {"success": True, "insights": insights}

    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": "Failed to parse AI response",
            "message": str(e)
        }
    except Exception as e:
        return {
            "success": False,
            "error": "Failed to generate insights",
            "message": str(e)
        }

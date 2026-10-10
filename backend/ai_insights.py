
import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()


def get_ai_insights(student_profile):
    """
    Takes student profile (resume + GitHub data + match results)
    Returns personalized placement insights using Groq.
    """
    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY is missing from the environment")

        client = Groq(api_key=api_key)

        skills = student_profile.get("skills", [])
        cgpa = student_profile.get("cgpa", 0)
        github_score = student_profile.get("github_score", 0)
        matches = student_profile.get("matches", [])
        target_companies = student_profile.get(
            "target_companies",
            ["Deutsche Bank", "Razorpay", "Zepto"]
        )

        shortlisted = [
            m for m in matches if m.get("will_shortlist", False)
        ]
        not_shortlisted = [
            m for m in matches if not m.get("will_shortlist", False)
        ]

        all_missing = []
        for match in not_shortlisted[:10]:
            all_missing.extend(match.get("missing_skills", []))

        missing_skills_count = {}
        for skill in all_missing:
            missing_skills_count[skill] = (
                missing_skills_count.get(skill, 0) + 1
            )

        top_missing = sorted(
            missing_skills_count.items(),
            key=lambda item: item[1],
            reverse=True
        )[:5]

        prompt = f"""
You are an expert placement counselor for a CS engineering student.

STUDENT PROFILE:
- Skills: {", ".join(skills) if skills else "None identified"}
- CGPA: {cgpa}
- GitHub Power Score: {github_score}/100
- Target Companies: {", ".join(target_companies)}

MATCH ANALYSIS:
- Likely Shortlist ({len(shortlisted)}):
  {", ".join(m["company"] for m in shortlisted[:5]) if shortlisted else "None"}
- Needs Work ({len(not_shortlisted)}):
  {", ".join(m["company"] for m in not_shortlisted[:5]) if not_shortlisted else "None"}

MISSING SKILLS:
{", ".join(f"{skill} (needed by {count} companies)" for skill, count in top_missing) or "No missing-skill data provided"}

Return a JSON object with exactly this structure.
Use realistic, personalized recommendations. Return valid JSON only.

{{
  "overall_assessment": "2-3 sentence summary",
  "realistic_targets": {{
    "high_confidence": ["company1"],
    "medium_confidence": ["company2"],
    "long_shot": ["company3"]
  }},
  "strength_areas": ["skill1", "skill2"],
  "critical_gaps": ["gap1", "gap2"],
  "action_plan": [
    {{
      "priority": "high",
      "action": "specific action",
      "timeline": "weeks",
      "impact": "why this matters"
    }},
    {{
      "priority": "medium",
      "action": "specific action",
      "timeline": "weeks",
      "impact": "why this matters"
    }},
    {{
      "priority": "low",
      "action": "specific action",
      "timeline": "weeks",
      "impact": "why this matters"
    }}
  ],
  "interview_focus_areas": ["topic1", "topic2", "topic3"],
  "confidence_score": 72
}}
"""

        # Call Groq using the model already verified in your tests.
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": "Return only a valid JSON object. Do not use Markdown."
                },
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=1500,
            temperature=0.3
        )

        raw = response.choices[0].message.content.strip()
        insights = json.loads(raw)

        return {
            "success": True,
            "insights": insights
        }

    except json.JSONDecodeError as e:
        print("JSON parsing failed:", e)
        print("Raw AI response:", repr(raw) if "raw" in locals() else "No response")
        return {
            "success": False,
            "error": "Failed to parse AI response",
            "message": str(e)
        }

    except Exception as e:
        print("AI insights error:", repr(e))
        return {
            "success": False,
            "error": "Failed to generate insights",
            "message": str(e)
        }

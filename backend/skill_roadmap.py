import os
import json
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

def get_skill_roadmap(data):
    """
    For each missing skill, generates a learning roadmap.
    Input: {
        "missing_skills": ["data structures", "docker", "mongodb"],
        "target_companies": ["Deutsche Bank", "Zepto"],
        "skills": ["python", "java", "sql"]
    }
    """
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    missing_skills    = data.get("missing_skills", [])
    target_companies  = data.get("target_companies", [])
    existing_skills   = data.get("skills", [])

    if not missing_skills:
        return {"success": False, "error": "No missing skills found"}

    # limit to top 6 most important gaps
    skills_to_analyze = missing_skills[:6]

    prompt = f"""You are a senior placement coach helping a CS engineering student prepare for tech placements.

Student profile:
- Already knows: {', '.join(existing_skills)}
- Missing skills: {', '.join(skills_to_analyze)}
- Target companies: {', '.join(target_companies) if target_companies else 'top tech companies'}

For each missing skill, create a focused learning roadmap.

Respond ONLY as a JSON array, no markdown, no extra text:
[
  {{
    "skill": "data structures",
    "priority": "high",
    "why_needed": "one sentence — which companies need it and why",
    "time_to_learn": "4-6 weeks",
    "topics": ["Arrays & Strings", "Linked Lists", "Trees & Graphs", "Dynamic Programming"],
    "resources": [
      {{"name": "Striver's DSA Sheet", "type": "free", "url": "https://takeuforward.org"}},
      {{"name": "Neetcode 150", "type": "free", "url": "https://neetcode.io"}}
    ],
    "companies_unlocked": ["Deutsche Bank", "Flipkart", "Amazon"]
  }}
]

Generate one object per skill. Keep resources real and free wherever possible.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2000,
            temperature=0.6
        )

        raw   = response.choices[0].message.content
        clean = raw.strip().replace("```json", "").replace("```", "").strip()
        roadmap = json.loads(clean)
        return {"success": True, "roadmap": roadmap}

    except json.JSONDecodeError as e:
        return {"success": False, "error": "Failed to parse response", "message": str(e)}
    except Exception as e:
        return {"success": False, "error": "Failed to generate roadmap", "message": str(e)}
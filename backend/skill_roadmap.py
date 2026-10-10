
import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()


def get_skill_roadmap(data):
    """Generate a learning roadmap for missing skills."""

    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY is missing")

        client = Groq(api_key=api_key)

        missing_skills = data.get("missing_skills", [])
        target_companies = data.get("target_companies", [])
        existing_skills = data.get("skills", [])

        if not missing_skills:
            return {
                "success": False,
                "error": "No missing skills found"
            }

        skills_to_analyze = missing_skills[:6]

        prompt = f"""
You are a senior placement coach helping a CS engineering
student prepare for technology placements.

Already knows: {', '.join(existing_skills)}
Missing skills: {', '.join(skills_to_analyze)}
Target companies: {', '.join(target_companies) if target_companies else 'top tech companies'}

Return one JSON object with a "roadmap" array.
Include exactly one roadmap item for each missing skill.

Each item must have:
- skill: string
- priority: "high", "medium", or "low"
- why_needed: one concise sentence
- time_to_learn: estimated duration
- topics: array of 3-5 topic strings
- resources: array of 2 resources, each with name, type, url
- companies_unlocked: array of company names

Use real resource URLs. Keep every field concise.
Return valid JSON only, without Markdown.

Required structure:
{{
  "roadmap": [
    {{
      "skill": "Data Structures",
      "priority": "high",
      "why_needed": "Important for coding interviews.",
      "time_to_learn": "4-6 weeks",
      "topics": ["Arrays", "Linked Lists", "Trees"],
      "resources": [
        {{
          "name": "Striver's DSA Sheet",
          "type": "free",
          "url": "https://takeuforward.org"
        }},
        {{
          "name": "NeetCode",
          "type": "free",
          "url": "https://neetcode.io"
        }}
      ],
      "companies_unlocked": ["Deutsche Bank", "Amazon"]
    }}
  ]
}}
"""

        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Output only valid JSON. "
                        "Follow the requested schema exactly. "
                        "Do not include Markdown fences or extra text."
                    )
                },
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=4000,
            temperature=0.2
        )

        raw = response.choices[0].message.content or ""
        result = json.loads(raw)

        # Accept the expected object format.
        roadmap = result.get("roadmap") if isinstance(result, dict) else None

        if not isinstance(roadmap, list):
            raise ValueError("AI response must contain a roadmap array")

        return {
            "success": True,
            "roadmap": roadmap
        }

    except json.JSONDecodeError as e:
        print("Roadmap JSON parsing error:", repr(e))
        print("Raw response:", repr(raw) if "raw" in locals() else "No response")
        return {
            "success": False,
            "error": "Failed to parse response",
            "message": str(e)
        }

    except Exception as e:
        print("Roadmap generation error:", repr(e))
        return {
            "success": False,
            "error": "Failed to generate roadmap",
            "message": str(e)
        }

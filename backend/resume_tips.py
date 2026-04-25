import os
import json
from groq import Groq
from dotenv import load_dotenv
load_dotenv()

def get_resume_tips(resume_data):
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    prompt = f"""You are a placement expert helping a CS student improve their resume for top tech companies.

Here is their profile:
- Skills: {', '.join(resume_data.get('skills', []))}
- CGPA: {resume_data.get('cgpa', 'Not found')}

Give exactly 5 short, specific, actionable resume tips targeting companies like Deutsche Bank, Razorpay and Zepto.

Respond ONLY as a JSON array, no extra text, no markdown:
[
  {{"tip": "tip title", "detail": "one sentence explanation", "priority": "high/medium/low"}},
  {{"tip": "tip title", "detail": "one sentence explanation", "priority": "high/medium/low"}},
  {{"tip": "tip title", "detail": "one sentence explanation", "priority": "high/medium/low"}},
  {{"tip": "tip title", "detail": "one sentence explanation", "priority": "high/medium/low"}},
  {{"tip": "tip title", "detail": "one sentence explanation", "priority": "high/medium/low"}}
]"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000
    )

    raw = response.choices[0].message.content
    clean = raw.strip().replace("```json", "").replace("```", "").strip()
    tips = json.loads(clean)
    return {"tips": tips}
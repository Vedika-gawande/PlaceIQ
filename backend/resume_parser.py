import pdfplumber
import re

SKILLS_DB = [
    "python", "java", "javascript", "react", "node", "flask", "django",
    "machine learning", "deep learning", "sql", "mongodb", "docker",
    "kubernetes", "git", "aws", "azure", "c++", "tensorflow", "pytorch"
]

def extract_cgpa(text_lower):
    patterns = [
        r"cgpa[:\s]*([0-9.]+)",
        r"gpa[:\s]*([0-9.]+)",
    ]
    for pattern in patterns:
        match = re.search(pattern, text_lower)
        if match:
            val = float(match.group(1))
            if 0 < val <= 10:
                return match
    return None

def parse_resume(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""

    text_lower = text.lower()

    found_skills = [s for s in SKILLS_DB if s in text_lower]
    cgpa_match   = extract_cgpa(text_lower)
    email_match  = re.search(r"[\w.-]+@[\w.-]+", text)

    return {
        "skills": found_skills,
        "cgpa":   float(cgpa_match.group(1)) if cgpa_match else None,
        "email":  email_match.group(0) if email_match else None
    }
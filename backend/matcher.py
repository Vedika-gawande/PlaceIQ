import json
import os

def match_companies(student_profile):
    with open(os.path.join(os.path.dirname(__file__), "data", "companies.json")) as f:
        companies = json.load(f)

    student_skills = set(s.lower() for s in student_profile.get("skills", []))
    github_score   = student_profile.get("github_score", 0)

    # sanitize CGPA once, outside the loop
    raw_cgpa = student_profile.get("cgpa", 0)
    cgpa     = float(raw_cgpa) if raw_cgpa else 0
    cgpa     = cgpa if 0 < cgpa <= 10 else 0

    results = []
    for company in companies:
        required     = set(s.lower() for s in company.get("required_skills", []))
        good_to_have = set(s.lower() for s in company.get("good_to_have", []))

        matched = student_skills & required
        missing = required - student_skills
        bonus   = student_skills & good_to_have

        # skill match — only count exact matches, no partial
        skill_match = len(matched) / len(required) if required else 0

        # CGPA match — strict, no free 0.5 default
        if cgpa == 0:
            cgpa_match = 0.3  # penalty for missing CGPA
        elif cgpa >= company.get("min_cgpa", 6.0):
            cgpa_match = 1.0
        else:
            cgpa_match = cgpa / company.get("min_cgpa", 6.0)

        # GitHub match — capped at 70
        github_match = min(1, github_score / 70)

        # bonus — reduced to 5% max
        bonus_score = min(0.05, (len(bonus) / max(len(good_to_have), 1)) * 0.05)

        # final score — rebalanced weights
        overall = round(
            (skill_match * 0.45 + cgpa_match * 0.30 + github_match * 0.20 + bonus_score) * 100,
            1
        )
        overall = min(overall, 100)

        results.append({
            "company":        company["name"],
            "domain":         company.get("domain", ""),
            "type":           company.get("type", ""),
            "match_percent":  overall,
            "matched_skills": list(matched),
            "missing_skills": list(missing),
            "bonus_skills":   list(bonus),
            "avg_package":    company.get("avg_package", "N/A"),
            "hiring_rounds":  company.get("hiring_rounds", []),
            "locations":      company.get("locations", []),
            "bond":           company.get("bond", "none"),
            "min_cgpa":       company.get("min_cgpa", 6.0),
            "will_shortlist": overall >= 60
        })

    return sorted(results, key=lambda x: x["match_percent"], reverse=True)
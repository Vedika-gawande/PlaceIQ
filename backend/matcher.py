def match_companies(student_profile):
    with open(os.path.join(os.path.dirname(__file__), "data", "companies.json")) as f:
        companies = json.load(f)

    student_skills = set(s.lower() for s in student_profile.get("skills", []))
    github_score   = student_profile.get("github_score", 0)

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

        skill_match  = len(matched) / len(required) if required else 0

        # 🔴 NEW: Hard cutoff — skill match < 40% → skip company entirely
        if skill_match < 0.4:
            continue

        cgpa_match = (1 if cgpa >= company.get("min_cgpa", 6.0)
              else (cgpa / company.get("min_cgpa", 6.0) if cgpa > 0 else 0))

        github_match = min(1, github_score / 70)
        bonus_score  = min(0.1, (len(bonus) / max(len(good_to_have), 1)) * 0.1)

        # 🔴 NEW weights: skill_match dominates (70%)
        overall = round(
            (skill_match * 0.70 + cgpa_match * 0.20 + github_match * 0.10 + bonus_score) * 100,
            1
        )
        overall = min(overall, 99)  # 🔴 100% kabhi nahi — always something to improve

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
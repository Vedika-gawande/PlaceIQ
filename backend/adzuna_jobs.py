import os
import requests

ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_API_KEY = os.getenv("ADZUNA_API_KEY")

def get_jobs(skills, location="india", company="", results_per_page=10):
    if not ADZUNA_APP_ID or not ADZUNA_API_KEY:
        return {"error": "Adzuna credentials missing"}

    # Company + skills sobat query
    skill_query = " ".join(skills[:2]) if skills else "software developer"
    query = f"{company} {skill_query}".strip() if company else skill_query

    url = f"https://api.adzuna.com/v1/api/jobs/in/search/1"
    
    params = {
    "app_id": ADZUNA_APP_ID,
    "app_key": ADZUNA_API_KEY,
    "results_per_page": results_per_page,
    "what": skill_query,      # skills only
    "where": location,
    "company": company,        # ← he add kar separate parameter
    "content-type": "application/json"
}

    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        jobs = []
        for job in data.get("results", []):
           jobs.append({
    "title": job.get("title"),
    "company": job.get("company", {}).get("display_name"),
    "location": job.get("location", {}).get("display_name"),
    "salary_min": job.get("salary_min"),
    "salary_max": job.get("salary_max"),
    "description": job.get("description", "")[:200],
    "url": job.get("redirect_url"),
    "contract_time": job.get("contract_time", ""),  # full_time / part_time
    "contract_type": job.get("contract_type", ""),  # permanent / contract
})
        
        return {"jobs": jobs, "total": data.get("count", 0)}
    
    except Exception as e:
        return {"error": str(e)}
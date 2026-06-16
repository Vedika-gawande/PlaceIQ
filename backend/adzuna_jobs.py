import os
import requests

LOCATION_MAP = {
    "india": "Mumbai",
    "bangalore": "Bangalore",
    "mumbai": "Mumbai",
    "hyderabad": "Hyderabad",
    "pune": "Pune",
    "delhi": "Delhi"
}

def get_jobs(skills, location="india", company="", results_per_page=10):
    app_id = os.getenv("ADZUNA_APP_ID")
    api_key = os.getenv("ADZUNA_API_KEY")

    if not app_id or not api_key:
        return {"jobs": [], "error": "Adzuna credentials missing"}

    skill_query = " ".join(skills[:3]) if skills else "software developer"
    mapped_location = LOCATION_MAP.get(location.lower(), "Mumbai")

    url = "https://api.adzuna.com/v1/api/jobs/in/search/1"
    
    params = {
        "app_id": app_id,
        "app_key": api_key,
        "results_per_page": results_per_page,
        "what": skill_query,
        "where": mapped_location,
        "content-type": "application/json"
    }
    
    if company:
        params["company"] = company

    try:
        response = requests.get(url, params=params)
        print("Status:", response.status_code)
        print("Response text:", response.text[:500])

        if response.status_code != 200:
            return {"jobs": [], "error": f"Adzuna API error: {response.status_code}"}
        
        if not response.text:
            return {"jobs": [], "error": "Empty response from Adzuna"}

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
                "contract_time": job.get("contract_time", ""),
                "contract_type": job.get("contract_type", ""),
            })
        
        return {"jobs": jobs, "total": data.get("count", 0)}
    
    except Exception as e:
        print("Exception:", str(e))
        return {"jobs": [], "error": str(e)}
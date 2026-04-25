import requests
import os
from dotenv import load_dotenv
load_dotenv()

def analyze_github(username):
    headers = {"Authorization": f"token {os.getenv('GITHUB_TOKEN')}"}
    base_url = f"https://api.github.com/users/{username}"

    user_res  = requests.get(base_url, headers=headers)
    repos_res = requests.get(f"{base_url}/repos?per_page=100", headers=headers)

    # if API fails, return safe error response
    if user_res.status_code != 200:
        return {
            "error": True,
            "message": f"GitHub API error: {user_res.status_code}",
            "username": username,
            "name": "N/A",
            "public_repos": 0,
            "followers": 0,
            "top_languages": [],
            "github_score": 0
        }

    user  = user_res.json()
    repos = repos_res.json()

    # repos might be an error dict instead of a list
    if not isinstance(repos, list):
        repos = []

    languages = {}
    for repo in repos:
        if not isinstance(repo, dict):
            continue
        lang = repo.get("language")
        if lang:
            languages[lang] = languages.get(lang, 0) + 1

    repo_count     = user.get("public_repos", 0)
    followers      = user.get("followers", 0)
    top_languages  = sorted(languages, key=languages.get, reverse=True)[:5]
    score          = min(100, (repo_count * 2) + (followers * 1.5) + (len(languages) * 5))

    return {
        "username": username,
        "name": user.get("name", "N/A"),
        "public_repos": repo_count,
        "followers": followers,
        "top_languages": top_languages,
        "github_score": round(score, 2)
    }
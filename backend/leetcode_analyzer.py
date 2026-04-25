import requests

LEETCODE_API = "https://leetcode.com/graphql"

# company DSA requirements based on real interview patterns
COMPANY_DSA_REQUIREMENTS = {
    "Google": {
        "easy": 50, "medium": 100, "hard": 30,
        "focus": ["graphs", "dp", "trees", "system design"]
    },
    "Microsoft": {
        "easy": 40, "medium": 80, "hard": 15,
        "focus": ["trees", "arrays", "dp", "graphs"]
    },
    "Amazon": {
        "easy": 40, "medium": 80, "hard": 10,
        "focus": ["arrays", "trees", "dp", "sliding window"]
    },
    "Flipkart": {
        "easy": 30, "medium": 60, "hard": 10,
        "focus": ["arrays", "trees", "graphs", "dp"]
    },
    "Deutsche Bank": {
        "easy": 30, "medium": 40, "hard": 5,
        "focus": ["arrays", "strings", "sql", "basic ds"]
    },
    "Razorpay": {
        "easy": 25, "medium": 50, "hard": 5,
        "focus": ["arrays", "strings", "trees", "hashing"]
    },
    "Zepto": {
        "easy": 20, "medium": 40, "hard": 3,
        "focus": ["arrays", "strings", "linked lists", "hashing"]
    },
    "Uber": {
        "easy": 40, "medium": 70, "hard": 15,
        "focus": ["graphs", "trees", "dp", "system design"]
    },
    "Adobe": {
        "easy": 35, "medium": 60, "hard": 10,
        "focus": ["arrays", "trees", "dp", "strings"]
    },
    "Atlassian": {
        "easy": 30, "medium": 60, "hard": 10,
        "focus": ["arrays", "trees", "graphs", "dp"]
    },
    "Infosys": {
        "easy": 20, "medium": 20, "hard": 0,
        "focus": ["arrays", "strings", "basic ds"]
    },
    "TCS": {
        "easy": 15, "medium": 10, "hard": 0,
        "focus": ["arrays", "strings", "basic ds"]
    },
    "Wipro": {
        "easy": 15, "medium": 10, "hard": 0,
        "focus": ["arrays", "strings", "basic ds"]
    },
    "Zoho": {
        "easy": 25, "medium": 30, "hard": 3,
        "focus": ["arrays", "strings", "trees", "dp"]
    },
    "Dream11": {
        "easy": 30, "medium": 55, "hard": 8,
        "focus": ["arrays", "dp", "graphs", "hashing"]
    },
    "PhonePe": {
        "easy": 30, "medium": 50, "hard": 5,
        "focus": ["arrays", "trees", "dp", "system design"]
    },
    "Paytm": {
        "easy": 25, "medium": 40, "hard": 3,
        "focus": ["arrays", "strings", "trees", "hashing"]
    },
    "CRED": {
        "easy": 30, "medium": 55, "hard": 8,
        "focus": ["arrays", "trees", "dp", "system design"]
    },
    "Groww": {
        "easy": 30, "medium": 50, "hard": 5,
        "focus": ["arrays", "trees", "dp", "hashing"]
    },
    "Walmart Global Tech": {
        "easy": 40, "medium": 70, "hard": 10,
        "focus": ["arrays", "trees", "dp", "graphs"]
    },
}

def analyze_leetcode(username):
    """
    Fetches real LeetCode stats using public GraphQL API.
    Returns solved counts by difficulty + company readiness.
    """
    query = """
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          ranking
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        userCalendar {
          streak
          totalActiveDays
        }
      }
    }
    """

    try:
        response = requests.post(
            LEETCODE_API,
            json={"query": query, "variables": {"username": username}},
            headers={
                "Content-Type": "application/json",
                "Referer": "https://leetcode.com",
                "User-Agent": "Mozilla/5.0"
            },
            timeout=10
        )

        data = response.json()

        if not data.get("data") or not data["data"].get("matchedUser"):
            return {"error": True, "message": f"User '{username}' not found on LeetCode"}

        user      = data["data"]["matchedUser"]
        stats     = user["submitStats"]["acSubmissionNum"]
        calendar  = user.get("userCalendar", {})

        # parse difficulty counts
        solved = {"All": 0, "Easy": 0, "Medium": 0, "Hard": 0}
        for s in stats:
            solved[s["difficulty"]] = s["count"]

        easy   = solved["Easy"]
        medium = solved["Medium"]
        hard   = solved["Hard"]
        total  = solved["All"]

        # overall DSA score (0-100)
        # formula: easy*0.5 + medium*2 + hard*5, capped at 100
        raw_score = min(100, (easy * 0.5) + (medium * 2) + (hard * 5))
        dsa_score = round(raw_score, 1)

        # level classification
        if total < 50:
            level = "Beginner"
        elif total < 150:
            level = "Developing"
        elif total < 300:
            level = "Intermediate"
        elif total < 500:
            level = "Advanced"
        else:
            level = "Expert"

        # company readiness
        company_readiness = []
        for company, req in COMPANY_DSA_REQUIREMENTS.items():
            easy_ok   = easy   >= req["easy"]
            medium_ok = medium >= req["medium"]
            hard_ok   = hard   >= req["hard"]

            # score as % of requirement met
            easy_pct   = min(100, round((easy   / max(req["easy"],   1)) * 100))
            medium_pct = min(100, round((medium / max(req["medium"], 1)) * 100))
            hard_pct   = min(100, round((hard   / max(req["hard"],   1)) * 100)) if req["hard"] > 0 else 100

            readiness = round((easy_pct * 0.3) + (medium_pct * 0.5) + (hard_pct * 0.2))
            ready     = easy_ok and medium_ok and hard_ok

            company_readiness.append({
                "company":        company,
                "readiness":      readiness,
                "ready":          ready,
                "required_easy":  req["easy"],
                "required_medium":req["medium"],
                "required_hard":  req["hard"],
                "focus_areas":    req["focus"],
            })

        # sort by readiness descending
        company_readiness.sort(key=lambda x: x["readiness"], reverse=True)

        return {
            "error":      False,
            "username":   username,
            "real_name":  user["profile"].get("realName", ""),
            "ranking":    user["profile"].get("ranking", 0),
            "streak":     calendar.get("streak", 0),
            "active_days":calendar.get("totalActiveDays", 0),
            "solved": {
                "total":  total,
                "easy":   easy,
                "medium": medium,
                "hard":   hard,
            },
            "dsa_score":          dsa_score,
            "level":              level,
            "company_readiness":  company_readiness,
        }

    except requests.Timeout:
        return {"error": True, "message": "LeetCode API timed out. Try again."}
    except Exception as e:
        return {"error": True, "message": str(e)}
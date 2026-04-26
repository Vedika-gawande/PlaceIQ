from resume_parser import parse_resume
with open("test_resume.pdf","rb") as f:
    result=parse_resume(f)
    print(result)

from github_analyzer import analyze_github
result=analyze_github("Vedika-gawande")
print(result)

from matcher import match_companies
profile={
    "skills":["python","java","javascript","sql","git","c++"],
    "cgpa":7.5,
    "github_score":68.0
}
result=match_companies(profile)
for r in result:
    print(r)
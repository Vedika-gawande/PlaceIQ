import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from github_analyzer import analyze_github
from resume_parser import parse_resume
from matcher import match_companies
from resume_tips import get_resume_tips
from ai_insights import get_ai_insights
from mock_interview import get_mock_questions
from skill_roadmap import get_skill_roadmap
from leetcode_analyzer import analyze_leetcode

app = Flask(__name__)

# ── SECURITY CONFIG ───────────────────────────────────
# only allow requests from your Vercel frontend
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://place-iq.vercel.app",     # ← correct!
    "https://place-iq-*.vercel.app",
]

CORS(app, origins=ALLOWED_ORIGINS)

# max resume upload size: 5MB
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024

# ── HEALTH CHECK (for keep-alive ping) ───────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "app": "PlaceIQ"})

# ── ERROR HANDLERS ────────────────────────────────────
@app.errorhandler(413)
def file_too_large(e):
    return jsonify({"error": "File too large. Max size is 5MB."}), 413

@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Something went wrong. Please try again."}), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found."}), 404

# ── ROUTES ────────────────────────────────────────────
@app.route("/analyze/github", methods=["POST"])
def github():
    data = request.json
    if not data or not data.get("username"):
        return jsonify({"error": "Username is required"}), 400
    return jsonify(analyze_github(data.get("username")))

@app.route("/analyze/resume", methods=["POST"])
def resume():
    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files["resume"]
    if not file.filename.endswith(".pdf"):
        return jsonify({"error": "Only PDF files are accepted"}), 400
    # file is processed in memory — never saved to disk
    return jsonify(parse_resume(file))

@app.route("/match", methods=["POST"])
def match():
    data = request.json
    if not data:
        return jsonify({"error": "Profile data required"}), 400
    return jsonify(match_companies(data))

@app.route("/analyze/resume-tips", methods=["POST"])
def resume_tips():
    data = request.json
    return jsonify(get_resume_tips(data))

@app.route("/insights", methods=["POST"])
def insights():
    data = request.json
    return jsonify(get_ai_insights(data))

@app.route("/mock-interview", methods=["POST"])
def mock_interview():
    data = request.json
    if not data or not data.get("company"):
        return jsonify({"error": "Company name required"}), 400
    return jsonify(get_mock_questions(data))

@app.route("/skill-roadmap", methods=["POST"])
def skill_roadmap():
    data = request.json
    return jsonify(get_skill_roadmap(data))

@app.route("/analyze/leetcode", methods=["POST"])
def leetcode():
    data = request.json
    if not data or not data.get("username"):
        return jsonify({"error": "LeetCode username required"}), 400
    return jsonify(analyze_leetcode(data.get("username")))

# ── RUN ───────────────────────────────────────────────
if __name__ == "__main__":
    # local dev only — Render uses gunicorn
    debug = os.getenv("FLASK_ENV") == "development"
    app.run(debug=debug, host='0.0.0.0', port=5000)
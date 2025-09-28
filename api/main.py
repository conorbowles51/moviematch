import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_BASE_URL = os.getenv("TMDB_BASE_URL")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS")

app = Flask(__name__)

CORS(app, origins=ALLOWED_ORIGINS)

@app.route("/movies/search")
def search_movies():
    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Missing query"})
    
    url = f"{TMDB_BASE_URL}/search/movie"
    headers = {
        "Authorization": f"Bearer {TMDB_API_KEY}"
    }
    params = {"query": query}

    resp = requests.get(url, headers=headers, params=params)
    resp.raise_for_status()
    return resp.json()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
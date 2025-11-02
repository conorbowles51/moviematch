import os
from flask import Blueprint, request, jsonify
from services.tmdb import search_movies, get_popular_movies

movies_bp = Blueprint("movies", __name__)

TMDB_IMAGE_BASE = os.getenv("TMDB_IMAGE_BASE")

@movies_bp.get("/search")
def search_movies_route():
    query = (request.args.get("q") or "").strip()
    page = request.args.get("page", default=1, type=int)

    if not query:
        return jsonify({ "results": [], "message": "No search query provided."}), 200
    
    try:
        data = search_movies(query, page)
        results = [
            {
                "id": m.get("id"),
                "title": m.get("title"),
                "overview": m.get("overview"),
                "poster_url": f"{m['poster_path']}" if m.get("poster_path") else None,
                "release_date": m.get("release_date"),
                "vote_average": m.get("vote_average"),
            }
            for m in data.get("results", [])
        ]
        return jsonify({
            "results": results,
            "page": data.get("page"),
            "total_results": data.get("total_results"),
            "total_pages": data.get("total_pages")
        }), 200
    except Exception as e:
        return jsonify({ "error": str(e)}), 500
    
@movies_bp.get("/popular")
def get_popular_movies_route():
    page = request.args.get("page", default=1, type=int)

    try:
        data = get_popular_movies(page)
        results = [
            {
                "id": m.get("id"),
                "title": m.get("title"),
                "overview": m.get("overview"),
                "poster_url": f"{m['poster_path']}" if m.get("poster_path") else None,
                "release_date": m.get("release_date"),
                "vote_average": m.get("vote_average"),
            }
            for m in data.get("results", [])
        ]
        return jsonify({
            "results": results,
            "page": data.get("page"),
            "total_results": data.get("total_results"),
            "total_pages": data.get("total_pages")
        }), 200
    except Exception as e:
        return jsonify({ "error": str(e)}), 500
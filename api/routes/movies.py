import os
from flask import Blueprint, request, jsonify
from services.tmdb import search_movies, get_popular_movies, get_movie_details

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

@movies_bp.get("/<int:movie_id>")
def get_movie_details_route(movie_id: int):
    try:
        m = get_movie_details(movie_id)
        # Map TMDB shape to our frontend-friendly shape
        result = {
            "id": m.get("id"),
            "title": m.get("title"),
            "tagline": m.get("tagline"),
            "overview": m.get("overview"),
            "poster_url": m.get("poster_path"),
            "backdrop_url": m.get("backdrop_path"),
            "release_date": m.get("release_date"),
            "vote_average": m.get("vote_average"),
            "runtime": m.get("runtime"),
            "genres": [g.get("name") for g in m.get("genres", []) if g.get("name")],
            "homepage": m.get("homepage"),
            "videos": [
                {
                    "id": v.get("id"),
                    "key": v.get("key"),
                    "name": v.get("name"),
                    "site": v.get("site"),
                    "type": v.get("type"),
                }
                for v in (m.get("videos", {}) or {}).get("results", [])
            ],
            "cast": [
                {
                    "id": c.get("id"),
                    "name": c.get("name"),
                    "character": c.get("character"),
                    "profile_path": c.get("profile_path"),
                }
                for c in (m.get("credits", {}) or {}).get("cast", [])[:15]
            ],
            "crew": [
                {
                    "id": c.get("id"),
                    "name": c.get("name"),
                    "job": c.get("job"),
                }
                for c in (m.get("credits", {}) or {}).get("crew", [])
            ],
        }
        return jsonify(result), 200
    except Exception as e:
        return jsonify({ "error": str(e) }), 500

from flask import Blueprint, json, request, jsonify
from flask_login import login_required, current_user

from app import db
from models.library_item import LibraryItem

from services.recommendationService import join_user_libraries
from services.openai import generate_recommendations
from services.tmdb import search_movies

recommendations_bp = Blueprint("recommendations", __name__)


@recommendations_bp.post("")
@login_required
def get_recommendations():
    """Return grouped user libraries in a tidy shape.
    Accepts JSON body only: { "user_ids": [1, 2, 3] }
    }
    """
    data = request.get_json(silent=True) or {}
    body_ids = data.get("user_ids")

    if body_ids is None:
        return jsonify({"error": "Missing user_ids in request body"}), 400

    # Validate and normalize IDs
    try:
        user_ids = [int(x) for x in body_ids]
        user_ids.append(current_user.id)
    except (TypeError, ValueError):
        return jsonify({"error": "user_ids must be a list of integers"}), 400

    if len(user_ids) == 0:
        return jsonify({"data": {}}), 200

    try:
        from models.user import User
        
        
        group_lib = join_user_libraries(user_ids)
        recs = generate_recommendations(group_lib)
        
     

        try:
            results = []
            for rec in recs["recommendations"]:
                m = search_movies(rec["title"], 1)["results"][0]

                results.append({
                    "id": m.get("id"),
                    "title": m.get("title"),
                    "overview": m.get("overview"),
                    "poster_url": f"{m['poster_path']}" if m.get("poster_path") else None,
                    "release_date": m.get("release_date"),
                    "vote_average": m.get("vote_average"),
                    "why": rec["why"]
                })

            print(json.dumps(results, indent=2))

        except Exception as e:
            print(e)

        return jsonify({"results": results}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

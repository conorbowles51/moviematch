from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from sqlalchemy.exc import IntegrityError
from app import db
from models.library_item import LibraryItem

library_bp = Blueprint("library", __name__)

@library_bp.get("")
@login_required
def list_library():
    items = (LibraryItem.query
             .filter_by(user_id=current_user.id)
             .order_by(LibraryItem.created_at.desc())
             .all())
    return jsonify([i.to_dict() for i in items]), 200

@library_bp.post("/add")
@login_required
def add_to_library():
    data = request.get_json() or {}
    movie = data.get("movie") or {}

    # Minimum required fields
    if not ("id" in movie and "title" in movie):
        return jsonify({ "error": "Missing required fields: id, title" })

    item = LibraryItem(
        user_id=current_user.id,
        movie_id=movie["id"],
        title=movie["title"],
        poster_path=movie.get("poster_path"),
        release_date=movie.get("release_date"),
        vote_average=movie.get("vote_average"),
    )

    try:
        db.session.add(item)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Already in library"}), 200
    
    return jsonify({"message": "Added", "item": item.to_dict()}), 201

@library_bp.delete("/remove/<int:movie_id>")
@login_required
def remove_from_library(movie_id: int):
    item = LibraryItem.query.filter_by(user_id=current_user.id, movie_id=movie_id).first()
    if not item:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Removed", "movie_id": movie_id}), 200
from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from sqlalchemy import or_
from app import db, bcrypt
from models.user import User

auth_bp = Blueprint("auth", __name__)


# === REGISTER ===
@auth_bp.post("/register")
def register():
    print("Hit register")
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    display_name = data.get("display_name", "")

    print("Payload: ", data)

    if not email or not password or not display_name:
        return jsonify({ "error": "Email, password, and display name are required" }), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({ "error": "Email already registered" }), 400
    
    try:
        print("Creating user")
        user = User(email=email, display_name=display_name)
        user.set_password(password)

        print("Adding user to db")
        db.session.add(user)
        db.session.commit()

        print("Logging in user")
        login_user(user)
        
        return jsonify({
            "id": user.id,
            "email": user.email,
            "display_name": user.display_name
        }), 201
    except Exception as e:
        print("REGISTER ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


# === LOGIN ===
@auth_bp.post("/login")
def login():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    user = User.query.filter_by(email=email).first()
    if user is None or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401
    
    login_user(user)
    return jsonify({
        "message": "Logged in successfully",
        "user": {"id": user.id, "email": user.email}
    }), 200



# === LOGOUT ===
@auth_bp.post("/logout")
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out"}), 200



# === CURRENT USER ===
@auth_bp.get("/me")
@login_required
def get_current_user():
    return jsonify({
        "id": current_user.id,
        "email": current_user.email,
        "display_name": current_user.display_name
    }), 200


# === SEARCH USERS ===
@auth_bp.get("/search")
@login_required
def search_users():
    """Search users by display name or email.
    Returns up to 10 users excluding the current user.
    Query param: q
    """
    query = (request.args.get("q") or "").strip()

    if not query:
        return jsonify({"results": []}), 200

    try:
        pattern = f"%{query}%"
        users = (
            User.query
            .filter(
                User.id != current_user.id,
                or_(
                    User.display_name.ilike(pattern),
                    User.email.ilike(pattern),
                ),
            )
            .order_by(User.display_name.asc())
            .limit(10)
            .all()
        )

        results = [
            {"id": u.id, "display_name": u.display_name, "email": u.email}
            for u in users
        ]
        return jsonify({"results": results}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from config import Config
from extensions.login import login_manager
from dotenv import load_dotenv

load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_BASE_URL = os.getenv("TMDB_BASE_URL")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS")

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    login_manager.init_app(app)

    CORS(app, supports_credentials=True, origins=ALLOWED_ORIGINS)

    # import models so Alembic sees them
    from models.user import User
    from models.library_item import LibraryItem

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # register blueprints
    from routes.auth import auth_bp
    from routes.movies import movies_bp
    from routes.library import library_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(movies_bp, url_prefix="/api/movies")
    app.register_blueprint(library_bp, url_prefix="/api/library")

    @app.get("/health")
    def health():
        return { "ok": True }
    
    return app
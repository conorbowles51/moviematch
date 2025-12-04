import os
from pathlib import Path

basedir = Path(__file__).resolve().parent

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", f"sqlite:///{basedir}/'moviematch.db'")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    TMDB_API_KEY = os.getenv("TMDB_API_KEY")

    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True

    REMEMBER_COOKIE_SAMESITE = "None"
    REMEMBER_COOKIE_SECURE = True


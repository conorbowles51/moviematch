from datetime import datetime
from app import db

from sqlalchemy import Column, Integer, ForeignKey, String, DateTime

class LibraryItem(db.Model):
    __tablename__ = "library_items"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    movie_id = db.Column(db.Integer, nullable=False)  # TMDB id
    title = db.Column(db.String(255), nullable=False)
    poster_path = db.Column(db.String(255))           # raw TMDB path
    release_date = db.Column(db.String(10))           # "YYYY-MM-DD"
    vote_average = db.Column(db.Float)

    created_at = db.Column(db.DateTime, default=datetime.now(), nullable=False)

    __table_args__ = (
        db.UniqueConstraint("user_id", "movie_id", name="uq_library_user_movie"),
    )


    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "movie_id": self.movie_id,
            "title": self.title,
            "poster_path": self.poster_path,
            "release_date": self.release_date,
            "vote_average": self.vote_average,
            "created_at": self.created_at.isoformat() + "Z",
        }
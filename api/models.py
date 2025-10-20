from datetime import datetime
from app import db

from sqlalchemy import Column, Integer, ForeignKey, String, DateTime

class User(db.Model):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    display_name = Column(String(255))
    created_at = Column(DateTime, default=datetime.now())
from datetime import datetime
from app import db

from sqlalchemy import Column, Integer, ForeignKey, String, DateTime
from flask_login import UserMixin
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()


# UserMixin gives flask built in properties, e.g, is_authenticated or get_id()

class User(db.Model, UserMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    display_name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.now())

    # helper methods for password hashing
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
from flask_login import LoginManager
from flask import jsonify

login_manager = LoginManager()

# this handler changes default behavior
# can now handle the 401 on the frontend instead

@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({ "error": "Unauthorized" }), 401
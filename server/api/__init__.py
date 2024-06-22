from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__, static_folder='../../skillsync-client/dist', static_url_path='')
    print(app.static_folder)
    CORS(app)
    
    from .routes import main_blueprint
    app.register_blueprint(main_blueprint)

    return app
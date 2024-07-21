from flask import Flask
from flask_cors import CORS
from routes.routes import main_blueprint
from utils.scheduler import register_scheduler
import logging
logging.basicConfig(level=logging.WARNING)

app = Flask(__name__)
app.register_blueprint(main_blueprint)
register_scheduler(app)
CORS(app)

if __name__ == "__main__":
        app.run(debug=True)

# gunicorn -b 0.0.0.0:8001 main:app

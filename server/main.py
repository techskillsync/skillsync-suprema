from dotenv import load_dotenv
load_dotenv()
from flask import Flask
from flask_cors import CORS
from flask_apscheduler import APScheduler
from api.routes import main_blueprint
from api.scheduler import scheduler_jobs

app = Flask(__name__, static_folder='../skillsync-client/dist', static_url_path='')
app.register_blueprint(main_blueprint)
CORS(app)

# Add scheduled jobs to app
scheduler = APScheduler()
scheduler.init_app(app)

for job in scheduler_jobs:
        scheduler.add_job(**job)
scheduler.start()

if __name__ == "__main__":
        app.run()

# gunicorn -b 0.0.0.0:8000 main:app
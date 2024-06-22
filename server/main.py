from dotenv import load_dotenv
load_dotenv()
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_apscheduler import APScheduler
from api.routes import main_blueprint
from api.scheduler import scheduler_jobs
import os

app = Flask(__name__, static_folder='../skillsync-client/dist', template_folder='../skillsync-client/dist')
@app.route('/')
@app.route('/<path:path>')
def serve(path='index.html'):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
CORS(app)

# # Add scheduled jobs to app
# scheduler = APScheduler()
# scheduler.init_app(app)

# for job in scheduler_jobs:
#         scheduler.add_job(**job)
# scheduler.start()

if __name__ == "__main__":
        app.run(debug=True)

# gunicorn -b 0.0.0.0:8000 main:app
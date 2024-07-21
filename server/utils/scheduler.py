from flask import Flask
from flask_apscheduler import APScheduler

scheduler_jobs = [
    # {
    #     "id": "update_job_listings",
    #     "func": upload_jobs_to_skillsync,
    #     "trigger": "cron",
    #     "hour": 12 # run at noon
    # },
]

def register_scheduler(app: Flask):
    scheduler = APScheduler()
    scheduler.init_app(app)

    for job in scheduler_jobs:
        scheduler.add_job(**job)
    scheduler.start()
from utils.FetchJobs import upload_jobs_to_skillsync

scheduler_jobs = [
    {
        "id": "update_job_listings",
        "func": upload_jobs_to_skillsync,
        "trigger": "cron",
        "hour": 12 # run at noon
    },
]
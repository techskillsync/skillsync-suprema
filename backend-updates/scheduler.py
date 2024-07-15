# scheduler.py
from apscheduler.schedulers.background import BackgroundScheduler
from scripts.FetchJobs import upload_jobs_to_skillsync
import time

def run_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(upload_jobs_to_skillsync, 'interval', minutes=5, args=("Technology", "Vancouver"), id='job_id', max_instances=1, start_date="2024-07-14T18:45:00", end_date='2024-07-14T19:40:00')
    scheduler.add_job(upload_jobs_to_skillsync, 'interval', minutes=5, args=("Finance", "Vancouver"), id='job_id', max_instances=1, start_date="2024-07-14T19:40:00", end_date='2024-07-14T20:40:00')
    scheduler.add_job(upload_jobs_to_skillsync, 'interval', minutes=5, args=("Healthcare", "Vancouver"), id='job_id', max_instances=1, start_date="2024-07-14T20:40:00", end_date='2024-07-14T21:40:00')
    scheduler.add_job(upload_jobs_to_skillsync, 'interval', minutes=5, args=("Education", "Vancouver"), id='job_id', max_instances=1, start_date="2024-07-14T21:40:00", end_date='2024-07-14T22:40:00')
    scheduler.add_job(upload_jobs_to_skillsync, 'interval', minutes=5, args=("Commerce", "Vancouver"), id='job_id', max_instances=1, start_date="2024-07-14T22:40:00", end_date='2024-07-14T23:40:00')
    scheduler.start()
    print('Scheduler started. Waiting for jobs...')

    try:
        # Run the scheduler for 2 hours
        time.sleep(7200)
    except KeyboardInterrupt:
        print('Scheduler interrupted.')
    finally:
        scheduler.shutdown()

if __name__ == '__main__':
    run_scheduler()

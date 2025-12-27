"""
Celery configuration for Strategic Horizon.
Handles periodic background tasks like KPI snapshots.
"""
import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'strategic_horizon.settings')

app = Celery('strategic_horizon')

# Load task modules from all registered Django app configs
app.config_from_object('django.conf:settings', namespace='CELERY')

# Celery configuration
app.conf.update(
    broker_url=os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0'),
    result_backend=os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0'),
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
)

# Auto-discover tasks from all installed apps
app.autodiscover_tasks()

# Periodic task schedule
app.conf.beat_schedule = {
    'snapshot-kpis-daily': {
        'task': 'kpis.tasks.snapshot_kpi_data',
        'schedule': crontab(hour=0, minute=0),  # Run daily at midnight
    },
    'check-people-contacts': {
        'task': 'people.tasks.check_contact_notifications',
        'schedule': crontab(hour=9, minute=0),  # Run daily at 9 AM
    },
    'update-system-health': {
        'task': 'systems.tasks.update_system_health',
        'schedule': crontab(hour='*/6'),  # Run every 6 hours
    },
}


@app.task(bind=True)
def debug_task(self):
    """Debug task for testing Celery."""
    print(f'Request: {self.request!r}')

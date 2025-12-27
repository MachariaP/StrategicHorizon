"""
Celery tasks for People module.
Handles periodic contact notification checks.
"""
from celery import shared_task
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


@shared_task
def check_contact_notifications():
    """
    Periodic background task to check for people needing contact.
    Identifies people who haven't been contacted within their frequency days.
    """
    from people.models import Person
    from django.contrib.auth.models import User
    
    logger.info("Starting contact notifications check task")
    
    # Get all non-deleted people
    people = Person.objects.filter(is_deleted=False)
    notifications = []
    
    for person in people:
        if person.needs_contact:
            days_overdue = abs(person.days_until_contact) if person.days_until_contact < 0 else 0
            
            notifications.append({
                'person_id': person.id,
                'person_name': person.name,
                'user_id': person.user.id,
                'user_email': person.user.email,
                'days_overdue': days_overdue,
                'last_contact': person.last_contact_date.isoformat() if person.last_contact_date else None
            })
            
            logger.info(f"Contact needed: {person.name} ({person.user.username}) - {days_overdue} days overdue")
    
    logger.info(f"Contact notifications check completed: {len(notifications)} notifications")
    
    # TODO: Send actual notifications via email/push notifications
    # For now, just log them
    
    return {
        'status': 'success',
        'notifications_count': len(notifications),
        'notifications': notifications
    }

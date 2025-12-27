"""
Celery tasks for Systems module.
Handles periodic health checks for systems.
"""
from celery import shared_task
import logging

logger = logging.getLogger(__name__)


@shared_task
def update_system_health():
    """
    Periodic background task to update system health status.
    Checks all systems and updates their health based on last execution date.
    """
    from systems.models import System
    
    logger.info("Starting system health update task")
    
    systems = System.objects.filter(is_deleted=False)
    updated_count = 0
    health_summary = {'healthy': 0, 'warning': 0, 'critical': 0, 'unknown': 0}
    
    for system in systems:
        old_status = system.health_status
        new_status = system.update_health_status()
        
        health_summary[new_status] += 1
        
        if old_status != new_status:
            logger.info(f"System '{system.name}' health changed: {old_status} -> {new_status}")
        
        updated_count += 1
    
    logger.info(f"System health update completed: {updated_count} systems checked")
    logger.info(f"Health summary: {health_summary}")
    
    return {
        'status': 'success',
        'checked': updated_count,
        'health_summary': health_summary
    }

"""
Celery tasks for KPI module.
Handles periodic background tasks like historical data snapshots.
"""
from celery import shared_task
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


@shared_task
def snapshot_kpi_data():
    """
    Periodic background task to snapshot KPI historical data.
    Creates a snapshot of current_value for all KPIs using KPIHistory model.
    
    Note: This task is now supplementary to the real-time signal-based history.
    It can be used for scheduled daily snapshots or backup purposes.
    """
    from kpis.models import KPI, KPIHistory
    
    logger.info("Starting KPI snapshot task")
    
    kpis = KPI.objects.filter(is_deleted=False)
    updated_count = 0
    
    for kpi in kpis:
        # Create a history entry using the new model
        KPIHistory.objects.create(
            kpi=kpi,
            value=kpi.current_value
        )
        updated_count += 1
    
    logger.info(f"KPI snapshot completed: {updated_count} KPIs snapshotted to KPIHistory")
    return {'status': 'success', 'updated': updated_count}

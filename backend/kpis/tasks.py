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
    Creates a snapshot of current_value for all KPIs for trend tracking.
    """
    from kpis.models import KPI
    
    logger.info("Starting KPI snapshot task")
    
    kpis = KPI.objects.filter(is_deleted=False)
    snapshot_date = timezone.now().date().isoformat()
    updated_count = 0
    
    for kpi in kpis:
        # Get current trend data or initialize
        trend_data = kpi.trend_data if kpi.trend_data else []
        
        # Add new snapshot
        trend_data.append({
            'date': snapshot_date,
            'value': float(kpi.current_value)
        })
        
        # Keep only last 365 days of data
        if len(trend_data) > 365:
            trend_data = trend_data[-365:]
        
        # Update KPI
        kpi.trend_data = trend_data
        kpi.save(update_fields=['trend_data'])
        updated_count += 1
    
    logger.info(f"KPI snapshot completed: {updated_count} KPIs updated")
    return {'status': 'success', 'updated': updated_count}

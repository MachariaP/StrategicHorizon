"""
Signals for KPI module to handle automatic updates.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import KPI, KPIHistory
import logging

logger = logging.getLogger(__name__)


@receiver(post_save, sender=KPI)
def update_goal_progress_on_kpi_change(sender, instance, created, **kwargs):
    """
    Signal to recalculate Goal progress when a KPI's current_value is updated.
    This ensures the Goal.progress_percentage reflects real-time KPI data.
    """
    if not created:  # Only trigger on updates, not on creation
        # Get the goal and trigger progress recalculation
        goal = instance.goal
        if goal:
            # The progress_percentage property will automatically recalculate
            # We just need to trigger any downstream updates if needed
            logger.info(
                f"KPI '{instance.name}' updated. Goal '{goal.title}' progress: {goal.progress_percentage}%"
            )


@receiver(post_save, sender=KPI)
def create_kpi_history_snapshot(sender, instance, created, **kwargs):
    """
    Automatically create a KPIHistory entry when a KPI's current_value changes.
    This provides real-time historical tracking without relying on Celery tasks.
    """
    # Only create history for significant changes, not on every save
    # Check if current_value actually changed
    if not created:
        # Get the previous value from the database
        try:
            old_kpi = KPI.objects.get(pk=instance.pk)
            if old_kpi.current_value != instance.current_value:
                KPIHistory.objects.create(
                    kpi=instance,
                    value=instance.current_value
                )
                logger.info(f"Created history snapshot for KPI '{instance.name}': {instance.current_value}")
        except KPI.DoesNotExist:
            pass
    else:
        # For new KPIs, create initial history entry
        KPIHistory.objects.create(
            kpi=instance,
            value=instance.current_value
        )
        logger.info(f"Created initial history snapshot for new KPI '{instance.name}'")

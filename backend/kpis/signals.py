"""
Signals for KPI module to handle automatic updates.
"""
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import KPI, KPIHistory
import logging

logger = logging.getLogger(__name__)

# Store previous values in thread-local storage to avoid extra DB queries
_kpi_previous_values = {}


@receiver(pre_save, sender=KPI)
def store_previous_kpi_value(sender, instance, **kwargs):
    """
    Store the previous current_value before save to check if it changed.
    This avoids an extra database query in the post_save signal.
    """
    if instance.pk:
        # Only store if this is an update (has primary key)
        _kpi_previous_values[instance.pk] = {
            'current_value': KPI.objects.filter(pk=instance.pk).values_list('current_value', flat=True).first()
        }


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
    should_create_history = False
    
    if created:
        # For new KPIs, always create initial history entry
        should_create_history = True
        logger.info(f"Created initial history snapshot for new KPI '{instance.name}'")
    elif instance.pk in _kpi_previous_values:
        # For updates, check if current_value actually changed
        previous_value = _kpi_previous_values.get(instance.pk, {}).get('current_value')
        if previous_value is not None and previous_value != instance.current_value:
            should_create_history = True
            logger.info(f"Created history snapshot for KPI '{instance.name}': {instance.current_value}")
        
        # Clean up the stored value
        del _kpi_previous_values[instance.pk]
    
    if should_create_history:
        KPIHistory.objects.create(
            kpi=instance,
            value=instance.current_value
        )


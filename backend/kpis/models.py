from django.db import models
from django.contrib.auth.models import User
from goals.models import Goal
from django.utils import timezone


class KPIHistory(models.Model):
    """
    Separate model for storing KPI historical snapshots.
    This allows for efficient database-level analytics and prevents JSONField bloat.
    """
    kpi = models.ForeignKey('KPI', on_delete=models.CASCADE, related_name='history')
    value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="KPI value at this point in time"
    )
    recorded_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when this snapshot was recorded"
    )
    
    class Meta:
        ordering = ['-recorded_at']
        verbose_name = 'KPI History'
        verbose_name_plural = 'KPI Histories'
        indexes = [
            models.Index(fields=['kpi', '-recorded_at']),
        ]
    
    def __str__(self):
        return f"{self.kpi.name} - {self.value} at {self.recorded_at.date()}"


class KPI(models.Model):
    """Key Performance Indicators linked to Goals with historical trend tracking"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='kpis')
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='kpis')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    current_value = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0,
        help_text="Current value of the KPI"
    )
    target_value = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        help_text="Target value to achieve"
    )
    unit = models.CharField(max_length=50, help_text="e.g., 'USD', '%', 'units'")
    trend_data = models.JSONField(
        default=list,
        blank=True,
        help_text="Historical snapshots of KPI values [{date, value}, ...]"
    )
    
    # Soft delete fields
    is_deleted = models.BooleanField(default=False, help_text="Soft delete flag")
    deleted_at = models.DateTimeField(null=True, blank=True, help_text="Deletion timestamp")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['goal', 'name']
        verbose_name = 'KPI'
        verbose_name_plural = 'KPIs'

    def __str__(self):
        return f"{self.name} - Target: {self.target_value} {self.unit}"

    @property
    def progress_percentage(self) -> float:
        """Calculate progress as percentage"""
        if not self.target_value or self.target_value <= 0:
            return 0.0
        return min((float(self.current_value) / float(self.target_value)) * 100, 100.0)
    
    @property
    def actual_value(self) -> float:
        """Alias for current_value for backward compatibility"""
        return float(self.current_value)
    
    def get_history_trend_data(self, days: int = 365) -> list:
        """
        Get trend data from KPIHistory model instead of JSONField.
        Returns list of dicts with date and value for the last N days.
        """
        from django.utils import timezone
        from datetime import timedelta
        
        cutoff_date = timezone.now() - timedelta(days=days)
        history_records = self.history.filter(
            recorded_at__gte=cutoff_date
        ).order_by('recorded_at')
        
        return [
            {
                'date': record.recorded_at.date().isoformat(),
                'value': float(record.value)
            }
            for record in history_records
        ]

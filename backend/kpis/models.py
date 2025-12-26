from django.db import models
from django.contrib.auth.models import User
from goals.models import Goal


class KPI(models.Model):
    """Key Performance Indicators linked to Goals"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='kpis')
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='kpis')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    target_value = models.DecimalField(max_digits=10, decimal_places=2)
    actual_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    unit = models.CharField(max_length=50, help_text="e.g., 'USD', '%', 'units'")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['goal', 'name']
        verbose_name = 'KPI'
        verbose_name_plural = 'KPIs'

    def __str__(self):
        return f"{self.name} - Target: {self.target_value} {self.unit}"

    @property
    def progress_percentage(self):
        """Calculate progress as percentage"""
        if self.target_value > 0:
            return (float(self.actual_value) / float(self.target_value)) * 100
        return 0

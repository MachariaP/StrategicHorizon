from django.db import models
from django.contrib.auth.models import User


class System(models.Model):
    """Recurring processes/habits with health tracking"""
    
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]
    
    HEALTH_CHOICES = [
        ('healthy', 'Healthy'),
        ('warning', 'Warning'),
        ('critical', 'Critical'),
        ('unknown', 'Unknown'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='systems')
    name = models.CharField(max_length=255)
    description = models.TextField(help_text="e.g., 'Sunday Weekly Review'")
    frequency = models.CharField(
        max_length=100, 
        choices=FREQUENCY_CHOICES,
        default='weekly',
        help_text="Rhythm: How often this system is executed"
    )
    input_definition = models.TextField(
        blank=True,
        help_text="What inputs are required for this system"
    )
    output_kpi_link = models.CharField(
        max_length=255,
        blank=True,
        help_text="Link to KPI that tracks output of this system"
    )
    last_execution_date = models.DateField(
        null=True,
        blank=True,
        help_text="Date of last execution"
    )
    health_status = models.CharField(
        max_length=20,
        choices=HEALTH_CHOICES,
        default='unknown',
        help_text="System health based on execution frequency"
    )
    
    # Soft delete fields
    is_deleted = models.BooleanField(default=False, help_text="Soft delete flag")
    deleted_at = models.DateTimeField(null=True, blank=True, help_text="Deletion timestamp")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.user.username} - {self.name}"
    
    def update_health_status(self) -> str:
        """
        Update system health based on last execution date.
        Returns the updated health status.
        """
        from django.utils import timezone
        
        if not self.last_execution_date:
            self.health_status = 'critical'
            self.save(update_fields=['health_status'])
            return self.health_status
        
        days_since_execution = (timezone.now().date() - self.last_execution_date).days
        
        # Map frequency to expected days
        frequency_map = {
            'daily': 1,
            'weekly': 7,
            'monthly': 30
        }
        
        expected_days = frequency_map.get(self.frequency, 7)
        
        if days_since_execution <= expected_days:
            self.health_status = 'healthy'
        elif days_since_execution <= expected_days * 2:
            self.health_status = 'warning'
        else:
            self.health_status = 'critical'
        
        self.save(update_fields=['health_status'])
        return self.health_status

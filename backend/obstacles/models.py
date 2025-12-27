from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from goals.models import Goal


class Obstacle(models.Model):
    """Pre-Mortem: Risks and their solutions with severity tracking"""
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='obstacles')
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='obstacles', null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(help_text="Describe the potential obstacle/risk")
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='medium')
    severity_index = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        default=5,
        help_text="Numeric severity index from 1 (minimal) to 10 (catastrophic)"
    )
    mitigation_plan = models.TextField(
        help_text="Detailed strategy to mitigate or resolve this obstacle",
        blank=True
    )
    is_blocking = models.BooleanField(
        default=False,
        help_text="Whether this obstacle is currently blocking goal/execution completion"
    )
    
    # Soft delete fields
    is_deleted = models.BooleanField(default=False, help_text="Soft delete flag")
    deleted_at = models.DateTimeField(null=True, blank=True, help_text="Deletion timestamp")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-severity', 'title']

    def __str__(self):
        return f"{self.user.username} - {self.title} ({self.severity})"
    
    @property
    def mitigation(self) -> str:
        """Alias for mitigation_plan for backward compatibility"""
        return self.mitigation_plan
    
    def save(self, *args, **kwargs):
        """Override save to update linked goal status if critical."""
        is_new = self.pk is None
        old_severity = None
        
        if not is_new:
            try:
                old_obstacle = Obstacle.objects.get(pk=self.pk)
                old_severity = old_obstacle.severity
            except Obstacle.DoesNotExist:
                pass
        
        super().save(*args, **kwargs)
        
        # If obstacle is critical and linked to a goal, update goal status
        if self.severity == 'critical' and self.goal:
            if self.goal.status != 'stalled':
                self.goal.status = 'stalled'
                self.goal.save(update_fields=['status'])
        
        # If severity changed from critical to non-critical, check if we can unstall the goal
        elif old_severity == 'critical' and self.severity != 'critical' and self.goal:
            # Check if there are any other critical obstacles for this goal
            other_critical = Obstacle.objects.filter(
                goal=self.goal,
                severity='critical',
                is_deleted=False
            ).exclude(pk=self.pk).exists()
            
            if not other_critical and self.goal.status == 'stalled':
                self.goal.status = 'in_progress'
                self.goal.save(update_fields=['status'])

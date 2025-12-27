from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from vision.models import Vision


class Goal(models.Model):
    """Specific, measurable milestones with status tracking and confidence levels"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('stalled', 'Stalled'),  # Added for obstacle integration
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    vision = models.ForeignKey(Vision, on_delete=models.CASCADE, related_name='goals', null=False, blank=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    confidence_level = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=3,
        help_text="Confidence level from 1 (low) to 5 (high)"
    )
    target_date = models.DateField(null=True, blank=True)
    
    # Soft delete fields
    is_deleted = models.BooleanField(default=False, help_text="Soft delete flag")
    deleted_at = models.DateTimeField(null=True, blank=True, help_text="Deletion timestamp")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['target_date', '-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.title}"
    
    @property
    def progress_percentage(self) -> float:
        """
        Calculate progress based on linked KPIs.
        Returns average progress of all linked KPIs.
        """
        kpis = self.kpis.all()
        if not kpis.exists():
            return 0.0
        
        total_progress = sum(kpi.progress_percentage for kpi in kpis)
        return round(total_progress / kpis.count(), 2)


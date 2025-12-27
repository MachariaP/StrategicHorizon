from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from vision.models import Vision
from core.models import BaseModel
from typing import Optional


class Goal(BaseModel):
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

    class Meta:
        ordering = ['target_date', '-created_at']

    def __str__(self) -> str:
        return f"{self.user.username} - {self.title}"
    
    def get_progress_percentage(self) -> float:
        """
        Calculate progress based on linked KPIs.
        
        Returns:
            Average progress of all linked KPIs as a percentage (0-100)
        
        Note:
            Current implementation iterates over KPIs in Python.
            For high-traffic scenarios, consider using database aggregation
            with annotations for better performance.
        """
        kpis = self.kpis.filter(is_deleted=False)
        if not kpis.exists():
            return 0.0
        
        total_progress = sum(kpi.progress_percentage for kpi in kpis)
        return round(total_progress / kpis.count(), 2)
    
    @property
    def progress_percentage(self) -> float:
        """
        Property wrapper for get_progress_percentage for backward compatibility.
        
        Returns:
            Average progress of all linked KPIs as a percentage (0-100)
        """
        return self.get_progress_percentage()
    
    def get_kpi_count(self) -> int:
        """
        Get the count of active KPIs linked to this goal.
        
        Returns:
            Number of non-deleted KPIs associated with this goal
        """
        return self.kpis.filter(is_deleted=False).count()


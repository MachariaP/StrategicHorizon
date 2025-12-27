from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from core.models import BaseModel
from typing import Optional


class VisionManager(models.Manager):
    """Custom manager for Vision model to handle soft deletes and active visions"""
    
    def get_queryset(self) -> models.QuerySet:
        """Return only non-deleted visions by default"""
        return super().get_queryset().filter(is_deleted=False)
    
    def archived(self) -> models.QuerySet:
        """Return only archived (soft deleted) visions"""
        return super().get_queryset().filter(is_deleted=True)
    
    def active(self) -> models.QuerySet:
        """Return only active visions"""
        return self.get_queryset().filter(is_active=True)


class Vision(BaseModel):
    """Yearly North Star statement and Theme with context engine capabilities"""
    
    class TimeHorizon(models.IntegerChoices):
        ONE_YEAR = 1, '1 Year'
        THREE_YEARS = 3, '3 Years'
        FIVE_YEARS = 5, '5 Years'
        TEN_YEARS = 10, '10 Years'
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='visions')
    year = models.IntegerField()
    north_star = models.TextField(help_text="Vision statement for the year")
    yearly_theme = models.CharField(max_length=200, help_text="e.g., 'Year of Scale'")
    time_horizon = models.IntegerField(
        choices=TimeHorizon.choices, 
        default=TimeHorizon.ONE_YEAR,
        help_text="Strategic planning time horizon"
    )
    five_whys = models.JSONField(
        default=list, 
        blank=True,
        help_text="Array of five 'why' statements for deeper understanding"
    )
    is_active = models.BooleanField(default=True, help_text="Active status")
    visual_url = models.URLField(
        max_length=500, 
        blank=True,
        help_text="Link to Unsplash or uploaded image"
    )
    
    # Use custom manager (overrides BaseModel manager)
    objects = VisionManager()
    all_objects = models.Manager()  # Access to all objects including deleted

    class Meta:
        ordering = ['-year']
        unique_together = ['user', 'year']

    def __str__(self) -> str:
        return f"{self.user.username} - {self.year}: {self.yearly_theme}"
    
    def get_goal_count(self) -> int:
        """
        Get the count of active goals linked to this vision.
        
        Returns:
            Number of non-deleted goals associated with this vision
        """
        return self.goals.filter(is_deleted=False).count()
    
    @property
    def health_score(self) -> float:
        """
        Calculate vision health based on goal status distribution.
        
        Returns a score from 0.0 to 100.0 where:
        - Completed goals: 100% contribution
        - In Progress goals: 60% contribution
        - Pending goals: 30% contribution
        - Stalled goals: 0% contribution
        
        Returns:
            Health score as a percentage (0-100)
        """
        goals = self.goals.filter(is_deleted=False)
        total_goals = goals.count()
        
        if total_goals == 0:
            return 0.0
        
        # Count goals by status
        completed = goals.filter(status='completed').count()
        in_progress = goals.filter(status='in_progress').count()
        pending = goals.filter(status='pending').count()
        stalled = goals.filter(status='stalled').count()
        
        # Calculate weighted health score
        score = (
            (completed * 100) +
            (in_progress * 60) +
            (pending * 30) +
            (stalled * 0)
        ) / total_goals
        
        return round(score, 2)

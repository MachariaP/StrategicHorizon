from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from .managers import VisionManager


class Vision(models.Model):
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
    is_deleted = models.BooleanField(default=False, help_text="Soft delete flag")
    deleted_at = models.DateTimeField(null=True, blank=True, help_text="Deletion timestamp")
    visual_url = models.URLField(
        max_length=500, 
        blank=True,
        help_text="Link to Unsplash or uploaded image"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Use custom manager
    objects = VisionManager()
    all_objects = models.Manager()  # Access to all objects including deleted

    class Meta:
        ordering = ['-year']
        unique_together = ['user', 'year']

    def __str__(self):
        return f"{self.user.username} - {self.year}: {self.yearly_theme}"
    
    def soft_delete(self):
        """Perform soft delete"""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()
    
    def restore(self):
        """Restore soft deleted vision"""
        self.is_deleted = False
        self.deleted_at = None
        self.save()

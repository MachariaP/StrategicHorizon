from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta


class QuarterlyReflection(models.Model):
    """Review module for Q1-Q4 to allow for plan pivots with immutability"""
    QUARTER_CHOICES = [
        (1, 'Q1'),
        (2, 'Q2'),
        (3, 'Q3'),
        (4, 'Q4'),
    ]
    
    TYPE_CHOICES = [
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reflections')
    reflection_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='quarterly',
        help_text="Type of reflection: weekly, monthly, or quarterly"
    )
    quarter = models.IntegerField(choices=QUARTER_CHOICES, null=True, blank=True)
    year = models.IntegerField()
    week_number = models.IntegerField(null=True, blank=True, help_text="Week number for weekly reflections")
    month = models.IntegerField(null=True, blank=True, help_text="Month number for monthly reflections")
    
    wins = models.TextField(help_text="What went well this period?")
    challenges = models.TextField(help_text="What didn't go as planned?")
    lessons_learned = models.TextField(help_text="Key takeaways and insights")
    adjustments = models.TextField(help_text="Plan adjustments for next period")
    gratitude_log = models.TextField(
        blank=True,
        help_text="What are you grateful for this period?"
    )
    
    is_locked = models.BooleanField(
        default=False,
        help_text="Locked for editing to preserve historical integrity"
    )
    locked_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Timestamp when reflection was locked"
    )
    
    # Soft delete fields
    is_deleted = models.BooleanField(default=False, help_text="Soft delete flag")
    deleted_at = models.DateTimeField(null=True, blank=True, help_text="Deletion timestamp")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-year', '-quarter', '-month', '-week_number']
        unique_together = [
            ['user', 'quarter', 'year', 'reflection_type'],
        ]

    def __str__(self):
        if self.reflection_type == 'quarterly' and self.quarter:
            return f"{self.user.username} - {self.get_quarter_display()} {self.year}"
        elif self.reflection_type == 'monthly' and self.month:
            return f"{self.user.username} - {self.year}-{self.month:02d}"
        elif self.reflection_type == 'weekly' and self.week_number:
            return f"{self.user.username} - {self.year} W{self.week_number}"
        return f"{self.user.username} - {self.reflection_type} {self.year}"
    
    def save(self, *args, **kwargs):
        """
        Override save to automatically lock reflections after 24 hours.
        """
        # If reflection is more than 24 hours old and not already locked, lock it
        if not self.is_locked and self.created_at:
            time_since_creation = timezone.now() - self.created_at
            if time_since_creation > timedelta(hours=24):
                self.is_locked = True
                self.locked_at = timezone.now()
        
        super().save(*args, **kwargs)
    
    @property
    def can_edit(self) -> bool:
        """Check if reflection can still be edited (within 24 hours of creation)."""
        if self.is_locked:
            return False
        
        if not self.created_at:
            return True
        
        time_since_creation = timezone.now() - self.created_at
        return time_since_creation <= timedelta(hours=24)
    
    @property
    def time_until_lock(self) -> timedelta:
        """Calculate time remaining until reflection is locked."""
        if self.is_locked or not self.created_at:
            return timedelta(0)
        
        time_since_creation = timezone.now() - self.created_at
        time_remaining = timedelta(hours=24) - time_since_creation
        return max(time_remaining, timedelta(0))

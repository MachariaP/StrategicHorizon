from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from vision.models import Vision
from core.models import BaseModel
from typing import Optional
from django.core.exceptions import ValidationError  # Added missing import


class Goal(BaseModel):
    """Specific, measurable milestones with status tracking and confidence levels"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('stalled', 'Stalled'),
    ]

    STRATEGIC_LEVEL_CHOICES = [
        ('high', 'High Level (Strategic)'),
        ('low', 'Low Level (Tactical)'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    vision = models.ForeignKey(Vision, on_delete=models.CASCADE, related_name='goals', null=False, blank=False)
    parent_goal = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        related_name='sub_goals',
        null=True,
        blank=True,
        help_text="Parent goal for cascading goals structure"
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    strategic_level = models.CharField(
        max_length=10,
        choices=STRATEGIC_LEVEL_CHOICES,
        default='low',
        db_index=True  # Critical optimization for filtering
    )
    confidence_level = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=3,
        help_text="Confidence level from 1 (low) to 5 (high)"
    )
    target_date = models.DateField(null=True, blank=True)
    
    # Weight for strategic cascading
    weight = models.FloatField(
        default=1.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(10.0)],
        help_text="Weight of this goal in parent's progress calculation (0-10)"
    )

    class Meta:
        ordering = ['strategic_level', 'target_date', '-created_at']
        indexes = [
            models.Index(fields=['strategic_level', 'status']),
            models.Index(fields=['user', 'vision', 'strategic_level']),
            models.Index(fields=['user', 'status', 'target_date']),
        ]

    def __str__(self) -> str:
        return f"{self.user.username} - {self.title} ({self.get_strategic_level_display()})"
    
    def get_progress_percentage(self) -> float:
        """
        Calculate progress based on linked KPIs OR sub-goals for strategic cascading.
        
        Returns:
            Weighted average progress considering KPIs and sub-goals
        """
        # Method 1: Calculate from KPIs (existing logic)
        kpis = self.kpis.filter(is_deleted=False)
        if kpis.exists():
            total_progress = sum(kpi.progress_percentage for kpi in kpis)
            return round(total_progress / kpis.count(), 2)
        
        # Method 2: Calculate from sub-goals (strategic cascading)
        sub_goals = self.sub_goals.filter(is_deleted=False)
        if sub_goals.exists():
            total_weight = sum(goal.weight for goal in sub_goals)
            if total_weight == 0:
                return 0.0
            
            weighted_progress = sum(
                goal.progress_percentage * goal.weight 
                for goal in sub_goals
            )
            return round(weighted_progress / total_weight, 2)
        
        return 0.0
    
    @property
    def progress_percentage(self) -> float:
        """
        Property wrapper for get_progress_percentage with caching.
        """
        return self.get_progress_percentage()
    
    def get_kpi_count(self) -> int:
        """
        Get the count of active KPIs linked to this goal.
        """
        return self.kpis.filter(is_deleted=False).count()
    
    def get_sub_goal_count(self) -> int:
        """
        Get the count of active sub-goals.
        """
        return self.sub_goals.filter(is_deleted=False).count()
    
    def get_total_weight(self) -> float:
        """
        Calculate total weight of all sub-goals.
        """
        return sum(goal.weight for goal in self.sub_goals.filter(is_deleted=False))
    
    def clean(self):
        """
        Validate strategic cascading rules.
        """
        super().clean()
        
        # Rule: High-level goals cannot have high-level parent goals
        if self.strategic_level == 'high' and self.parent_goal and self.parent_goal.strategic_level == 'high':
            raise ValidationError(
                "High-level goals can only have low-level sub-goals."
            )
        
        # Rule: Parent goal must belong to same user and vision
        if self.parent_goal:
            if self.parent_goal.user != self.user:
                raise ValidationError(
                    "Parent goal must belong to the same user."
                )
            if self.parent_goal.vision != self.vision:
                raise ValidationError(
                    "Parent goal must belong to the same vision."
                )
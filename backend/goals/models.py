from django.db import models
from django.contrib.auth.models import User
from vision.models import Vision


class Goal(models.Model):
    """Specific, measurable milestones with status tracking"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    vision = models.ForeignKey(Vision, on_delete=models.CASCADE, related_name='goals', null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    target_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['target_date', '-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.title}"

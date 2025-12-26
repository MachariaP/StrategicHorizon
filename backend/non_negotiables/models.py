from django.db import models
from django.contrib.auth.models import User


class NonNegotiable(models.Model):
    """Daily/weekly boundaries or rules"""
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='non_negotiables')
    title = models.CharField(max_length=255)
    description = models.TextField()
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='daily')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['frequency', 'title']

    def __str__(self):
        return f"{self.user.username} - {self.title} ({self.frequency})"

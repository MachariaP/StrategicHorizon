from django.db import models
from django.contrib.auth.models import User


class System(models.Model):
    """Recurring processes/habits"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='systems')
    name = models.CharField(max_length=255)
    description = models.TextField(help_text="e.g., 'Sunday Weekly Review'")
    frequency = models.CharField(max_length=100, help_text="How often this system is executed")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.user.username} - {self.name}"

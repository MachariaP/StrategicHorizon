from django.db import models
from django.contrib.auth.models import User
from goals.models import Goal


class Obstacle(models.Model):
    """Pre-Mortem: Risks and their solutions"""
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
    mitigation = models.TextField(help_text="Strategy to mitigate or resolve this obstacle")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-severity', 'title']

    def __str__(self):
        return f"{self.user.username} - {self.title} ({self.severity})"

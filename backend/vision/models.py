from django.db import models
from django.contrib.auth.models import User


class Vision(models.Model):
    """Yearly North Star statement and Theme"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='visions')
    year = models.IntegerField()
    north_star = models.TextField(help_text="Vision statement for the year")
    yearly_theme = models.CharField(max_length=200, help_text="e.g., 'Year of Scale'")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-year']
        unique_together = ['user', 'year']

    def __str__(self):
        return f"{self.user.username} - {self.year}: {self.yearly_theme}"

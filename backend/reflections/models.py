from django.db import models
from django.contrib.auth.models import User


class QuarterlyReflection(models.Model):
    """Review module for Q1-Q4 to allow for plan pivots"""
    QUARTER_CHOICES = [
        (1, 'Q1'),
        (2, 'Q2'),
        (3, 'Q3'),
        (4, 'Q4'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reflections')
    quarter = models.IntegerField(choices=QUARTER_CHOICES)
    year = models.IntegerField()
    wins = models.TextField(help_text="What went well this quarter?")
    challenges = models.TextField(help_text="What didn't go as planned?")
    lessons_learned = models.TextField(help_text="Key takeaways and insights")
    adjustments = models.TextField(help_text="Plan adjustments for next quarter")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-year', '-quarter']
        unique_together = ['user', 'quarter', 'year']

    def __str__(self):
        return f"{self.user.username} - {self.get_quarter_display()} {self.year}"

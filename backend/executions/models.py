from django.db import models
from django.contrib.auth.models import User
from goals.models import Goal


class Execution(models.Model):
    """Monthly roadmap (Jan-Dec) with specific tasks"""
    MONTH_CHOICES = [
        (1, 'January'), (2, 'February'), (3, 'March'), (4, 'April'),
        (5, 'May'), (6, 'June'), (7, 'July'), (8, 'August'),
        (9, 'September'), (10, 'October'), (11, 'November'), (12, 'December'),
    ]

    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('deferred', 'Deferred'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='executions')
    goal = models.ForeignKey(Goal, on_delete=models.CASCADE, related_name='executions', null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    month = models.IntegerField(choices=MONTH_CHOICES)
    year = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    
    # Soft delete fields
    is_deleted = models.BooleanField(default=False, help_text="Soft delete flag")
    deleted_at = models.DateTimeField(null=True, blank=True, help_text="Deletion timestamp")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['year', 'month']

    def __str__(self):
        return f"{self.user.username} - {self.get_month_display()} {self.year}: {self.title}"

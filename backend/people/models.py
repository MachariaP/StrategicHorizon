from django.db import models
from django.contrib.auth.models import User


class Person(models.Model):
    """Directory of mentors, partners, or supporters"""
    ROLE_CHOICES = [
        ('mentor', 'Mentor'),
        ('partner', 'Partner'),
        ('supporter', 'Supporter'),
        ('advisor', 'Advisor'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='people')
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    role_description = models.TextField(help_text="Specific role/contribution")
    contact_info = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'People'

    def __str__(self):
        return f"{self.name} - {self.role}"

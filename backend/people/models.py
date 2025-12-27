from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator


class Person(models.Model):
    """Directory of mentors, partners, or supporters with relationship tracking"""
    ROLE_CHOICES = [
        ('mentor', 'Mentor'),
        ('partner', 'Partner'),
        ('supporter', 'Supporter'),
        ('advisor', 'Advisor'),
        ('other', 'Other'),
    ]
    
    RELATIONSHIP_DEPTH_CHOICES = [
        (1, 'Acquaintance'),
        (2, 'Professional Contact'),
        (3, 'Regular Collaborator'),
        (4, 'Close Associate'),
        (5, 'Trusted Confidant'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='people')
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    role_description = models.TextField(help_text="Specific role/contribution")
    contact_info = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    
    # Relationship tracking
    relationship_depth = models.IntegerField(
        choices=RELATIONSHIP_DEPTH_CHOICES,
        default=2,
        help_text="Depth of relationship from 1 (acquaintance) to 5 (trusted confidant)"
    )
    last_contact_date = models.DateField(
        null=True,
        blank=True,
        help_text="Date of last contact"
    )
    frequency_days = models.IntegerField(
        validators=[MinValueValidator(1)],
        default=30,
        help_text="Expected contact frequency in days"
    )
    
    # Soft delete fields
    is_deleted = models.BooleanField(default=False, help_text="Soft delete flag")
    deleted_at = models.DateTimeField(null=True, blank=True, help_text="Deletion timestamp")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'People'

    def __str__(self):
        return f"{self.name} - {self.role}"
    
    @property
    def needs_contact(self) -> bool:
        """Check if this person needs to be contacted based on frequency."""
        from django.utils import timezone
        
        if not self.last_contact_date:
            return True
        
        days_since_contact = (timezone.now().date() - self.last_contact_date).days
        return days_since_contact >= self.frequency_days
    
    @property
    def days_until_contact(self) -> int:
        """Calculate days until next contact is due (negative if overdue)."""
        from django.utils import timezone
        
        if not self.last_contact_date:
            return -self.frequency_days
        
        days_since_contact = (timezone.now().date() - self.last_contact_date).days
        return self.frequency_days - days_since_contact

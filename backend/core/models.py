"""
Core models providing base functionality for all Strategic Horizon apps.
"""
import uuid
from django.db import models
from django.utils import timezone
from typing import Optional


class BaseModelManager(models.Manager):
    """Custom manager for BaseModel to handle soft deletes"""
    
    def get_queryset(self) -> models.QuerySet:
        """Return only non-deleted objects by default"""
        return super().get_queryset().filter(is_deleted=False)
    
    def archived(self) -> models.QuerySet:
        """Return only archived (soft deleted) objects"""
        return super().get_queryset().filter(is_deleted=True)


class BaseModel(models.Model):
    """
    Abstract base model providing common fields for all models:
    - UUID primary key
    - Created/Updated timestamps
    - Soft delete functionality
    """
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when object was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when object was last updated"
    )
    is_deleted = models.BooleanField(
        default=False,
        help_text="Soft delete flag"
    )
    deleted_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Timestamp when object was soft deleted"
    )
    
    # Use custom manager
    objects = BaseModelManager()
    all_objects = models.Manager()  # Access to all objects including deleted
    
    class Meta:
        abstract = True
        ordering = ['-created_at']
    
    def soft_delete(self) -> None:
        """Perform soft delete on the object"""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()
    
    def restore(self) -> None:
        """Restore a soft deleted object"""
        self.is_deleted = False
        self.deleted_at = None
        self.save()

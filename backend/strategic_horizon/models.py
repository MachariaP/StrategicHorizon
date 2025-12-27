"""
Base models for the Strategic Horizon application.
Provides common functionality like soft delete across all apps.
"""
import uuid
from django.db import models
from django.utils import timezone


class BaseModelManager(models.Manager):
    """Custom manager that excludes soft-deleted items by default."""
    
    def get_queryset(self):
        """Return only non-deleted items."""
        return super().get_queryset().filter(is_deleted=False)
    
    def archived(self):
        """Return only soft-deleted items."""
        return super().get_queryset().filter(is_deleted=True)
    
    def with_deleted(self):
        """Return all items including deleted ones."""
        return super().get_queryset()


class BaseModel(models.Model):
    """
    Abstract base model that all Strategic Horizon models should inherit from.
    Provides:
    - UUID primary keys to prevent ID enumeration
    - Soft delete functionality
    - Common timestamp fields
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    is_deleted = models.BooleanField(default=False, help_text="Soft delete flag")
    deleted_at = models.DateTimeField(null=True, blank=True, help_text="Deletion timestamp")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Default manager excludes deleted items
    objects = BaseModelManager()
    # All objects manager includes deleted items
    all_objects = models.Manager()
    
    class Meta:
        abstract = True
    
    def soft_delete(self):
        """Perform soft delete."""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()
    
    def restore(self):
        """Restore soft deleted item."""
        self.is_deleted = False
        self.deleted_at = None
        self.save()

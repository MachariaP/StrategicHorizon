from django.db import models


class VisionManager(models.Manager):
    """Custom manager for Vision model to handle soft deletes"""
    
    def get_queryset(self):
        """Return only non-deleted visions by default"""
        return super().get_queryset().filter(is_deleted=False)
    
    def archived(self):
        """Return only archived (soft deleted) visions"""
        return super().get_queryset().filter(is_deleted=True)
    
    def active(self):
        """Return only active visions"""
        return self.get_queryset().filter(is_active=True)

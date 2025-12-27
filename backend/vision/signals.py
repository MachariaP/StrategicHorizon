from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils import timezone
from django.db import DatabaseError
from .models import Vision
import logging

logger = logging.getLogger(__name__)


@receiver(pre_save, sender=Vision)
def track_vision_deletion(sender, instance, **kwargs):
    """Track when a vision is being soft deleted"""
    if instance.pk:
        try:
            # Use filter().first() to safely check if record exists without raising exceptions
            old_instance = Vision.all_objects.filter(pk=instance.pk).first()
            if old_instance:
                # Check if vision is being soft deleted
                if not old_instance.is_deleted and instance.is_deleted:
                    # This will trigger the post_save signal
                    pass
        except DatabaseError as e:
            # Handle database errors gracefully (e.g., during migrations or schema mismatches)
            logger.debug(f"Database error in track_vision_deletion signal: {e}")
        except Exception as e:
            # Catch any other unexpected errors to prevent signal failures from breaking saves
            logger.warning(f"Unexpected error in track_vision_deletion signal: {e}")


@receiver(post_save, sender=Vision)
def create_archive_log(sender, instance, created, **kwargs):
    """Create an archive log entry when a vision is soft deleted"""
    if not created and instance.is_deleted:
        # Log the archive event
        # In a production environment, you could create an ArchiveLog model
        # For now, we'll just log it
        logger.info(
            f"Vision archived - User: {instance.user.username}, "
            f"Year: {instance.year}, Theme: {instance.yearly_theme}, "
            f"Deleted at: {instance.deleted_at}"
        )
        # This allows admins to see why users are abandoning their dreams
        # and provides data for the strategy feedback loop
